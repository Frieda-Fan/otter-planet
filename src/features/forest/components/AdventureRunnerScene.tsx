import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { otterCharacterImage } from '../../../assets/characters/otter';
import { forestGeneratedSceneAssets, forestNpcImageAssets } from '../assets';
import { forestExplorationFirstPersonBackgroundImage } from '../assets/backgrounds';

type RunnerEncounter = {
  id: string;
  npcName: string;
  npcImage: string;
  title: string;
  dialogue: string;
  options: string[];
};

const RUN_SPEED = 8;
const ENCOUNTER_INTERVAL_SECONDS = 10;
const TILE_COUNT = 9;
const TILE_LENGTH = 16;
const POOL_COUNT = 18;

const runnerEncounters: RunnerEncounter[] = [
  {
    id: 'meet-shanshan',
    npcName: '闪闪',
    npcImage: forestNpcImageAssets.shanshan,
    title: '第一束光',
    dialogue: '我看见月亮的光往森林更深处飞去了。跟着发亮的小路走，它会把你带到下一位朋友面前。',
    options: ['跟着星光走', '点亮脚下的路', '和小水獭一起出发'],
  },
  {
    id: 'meet-xiaobeike',
    npcName: '小贝壳',
    npcImage: forestNpcImageAssets.xiaobeike,
    title: '会听见的森林',
    dialogue: '这条路会记住你的发现。树冠、浮石、月瀑和晶体，都会因为你看见它们而亮起来。',
    options: ['说出看到的光', '继续观察森林', '靠近发光晶体'],
  },
  {
    id: 'meet-kiwi',
    npcName: '猕猴桃先生',
    npcImage: forestNpcImageAssets.mrKiwi,
    title: '真假月亮',
    dialogue: '前方那轮月亮太安静了。真正的月亮会回应你的想象，我们要再往前确认一次。',
    options: ['回想一路线索', '靠近月亮看看', '继续向深处探索'],
  },
];

type RunnerStageProps = {
  activeEncounter: RunnerEncounter | null;
  isPaused: boolean;
  onEncounterReady: (encounter: RunnerEncounter) => void;
  onNpcClick: () => void;
};

function RunnerCamera() {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(0, 4.6, 8), 0.08);
    camera.lookAt(0, 1.05, -7);
  });

  return null;
}

function MovingTiles({ isPaused, onEncounterReady, activeEncounter, onNpcClick }: RunnerStageProps) {
  const tileRefs = useRef<Array<THREE.Group | null>>([]);
  const propRefs = useRef<Array<THREE.Group | null>>([]);
  const elapsedRef = useRef(0);
  const encounterIndexRef = useRef(0);
  const roadTexture = useLoader(THREE.TextureLoader, forestGeneratedSceneAssets.forestMoonlitRoadCurveB);
  const treeTextureA = useLoader(THREE.TextureLoader, forestGeneratedSceneAssets.forestInvertedTreeClusterA);
  const treeTextureB = useLoader(THREE.TextureLoader, forestGeneratedSceneAssets.forestInvertedTreeClusterB);
  const rockTexture = useLoader(THREE.TextureLoader, forestGeneratedSceneAssets.forestFloatingRockClusterB);
  const crystalTexture = useLoader(THREE.TextureLoader, forestGeneratedSceneAssets.forestFloatingCrystal);
  const glowTexture = useLoader(THREE.TextureLoader, forestGeneratedSceneAssets.forestGlowStar);
  const npcTextures = useLoader(
    THREE.TextureLoader,
    runnerEncounters.map((encounter) => encounter.npcImage),
  ) as THREE.Texture[];
  const activeNpcTexture = activeEncounter
    ? npcTextures[runnerEncounters.findIndex((encounter) => encounter.id === activeEncounter.id)]
    : null;

  const tiles = useMemo(
    () =>
      Array.from({ length: TILE_COUNT }, (_, index) => ({
        id: `tile-${index}`,
        z: -index * TILE_LENGTH,
      })),
    [],
  );

  const props = useMemo(
    () =>
      Array.from({ length: POOL_COUNT }, (_, index) => ({
        id: `prop-${index}`,
        x: index % 2 === 0 ? -6.4 - (index % 3) : 6.4 + (index % 3),
        y: 1.8 + (index % 4) * 0.22,
        z: -8 - index * 7,
        scale: 1 + (index % 5) * 0.14,
        kind: index % 5,
      })),
    [],
  );

  useFrame((_, delta) => {
    if (isPaused) {
      return;
    }

    const movement = RUN_SPEED * delta;
    elapsedRef.current += delta;

    tileRefs.current.forEach((tile) => {
      if (!tile) {
        return;
      }

      tile.position.z += movement;
      if (tile.position.z > TILE_LENGTH) {
        tile.position.z -= TILE_COUNT * TILE_LENGTH;
      }
    });

    propRefs.current.forEach((item, index) => {
      if (!item) {
        return;
      }

      item.position.z += movement;
      if (item.position.z > 12) {
        item.position.z -= POOL_COUNT * 7;
        item.position.x = index % 2 === 0 ? -6.2 - (index % 3) : 6.2 + (index % 3);
      }
    });

    const nextEncounter = runnerEncounters[encounterIndexRef.current];
    if (
      nextEncounter &&
      !activeEncounter &&
      elapsedRef.current >= (encounterIndexRef.current + 1) * ENCOUNTER_INTERVAL_SECONDS
    ) {
      encounterIndexRef.current += 1;
      onEncounterReady(nextEncounter);
    }
  });

  return (
    <>
      {tiles.map((tile, index) => (
        <group
          key={tile.id}
          ref={(node) => {
            tileRefs.current[index] = node;
          }}
          position={[0, 0, tile.z]}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
            <planeGeometry args={[18, TILE_LENGTH]} />
            <meshStandardMaterial color="#173328" roughness={0.92} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <planeGeometry args={[7.5, TILE_LENGTH]} />
            <meshBasicMaterial map={roadTexture} transparent opacity={0.74} depthWrite={false} />
          </mesh>
        </group>
      ))}

      {props.map((item, index) => {
        const texture =
          item.kind === 0 ? treeTextureA :
          item.kind === 1 ? treeTextureB :
          item.kind === 2 ? rockTexture :
          item.kind === 3 ? crystalTexture :
          glowTexture;
        const width = item.kind < 2 ? 5.8 : 1.8;
        const height = item.kind < 2 ? 4.2 : 1.8;

        return (
          <group
            key={item.id}
            ref={(node) => {
              propRefs.current[index] = node;
            }}
            position={[item.x, item.y, item.z]}
            scale={item.scale}
          >
            <mesh>
              <planeGeometry args={[width, height]} />
              <meshBasicMaterial
                map={texture}
                transparent
                opacity={item.kind < 2 ? 0.82 : 0.72}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </group>
        );
      })}

      {activeEncounter && activeNpcTexture ? (
        <mesh position={[0, 1.72, -7]} onClick={onNpcClick}>
          <planeGeometry args={[2.1, 2.1]} />
          <meshBasicMaterial
            map={activeNpcTexture}
            transparent
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ) : null}
    </>
  );
}

function OtterRunner() {
  const otterTexture = useLoader(THREE.TextureLoader, otterCharacterImage);
  const bounceRef = useRef<THREE.Group | null>(null);

  useFrame(({ clock }) => {
    if (!bounceRef.current) {
      return;
    }

    const time = clock.getElapsedTime();
    bounceRef.current.position.y = 0.92 + Math.sin(time * 9) * 0.035;
    bounceRef.current.rotation.z = Math.sin(time * 7) * 0.025;
  });

  return (
    <group ref={bounceRef} position={[0, 0.92, 1.15]}>
      <mesh scale={[-1, 1, 1]}>
        <planeGeometry args={[1.28, 1.72]} />
        <meshBasicMaterial
          map={otterTexture}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
          opacity={0.94}
        />
      </mesh>
    </group>
  );
}

function RunnerStage(props: RunnerStageProps) {
  const backdropTexture = useLoader(THREE.TextureLoader, forestExplorationFirstPersonBackgroundImage);

  return (
    <>
      <color attach="background" args={['#071421']} />
      <fog attach="fog" args={['#071421', 12, 54]} />
      <ambientLight intensity={1.35} />
      <directionalLight position={[3, 8, 5]} intensity={1.6} color="#ffe2a0" />
      <pointLight position={[0, 2.2, 2]} intensity={1.7} color="#a7f1c0" distance={9} />
      <RunnerCamera />
      <mesh position={[0, 4.5, -30]}>
        <planeGeometry args={[42, 24]} />
        <meshBasicMaterial map={backdropTexture} transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <MovingTiles {...props} />
      <OtterRunner />
    </>
  );
}

export function AdventureRunnerScene() {
  const navigate = useNavigate();
  const [activeEncounter, setActiveEncounter] = useState<RunnerEncounter | null>(null);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [finishedEncounters, setFinishedEncounters] = useState(0);

  const isPaused = Boolean(activeEncounter);

  const continueExploring = () => {
    setFinishedEncounters((count) => {
      const nextCount = Math.min(count + 1, runnerEncounters.length);

      if (nextCount >= runnerEncounters.length) {
        navigate('/story-retell');
      }

      return nextCount;
    });
    setActiveEncounter(null);
    setIsStoryOpen(false);
  };

  return (
    <div className="adventure-runner">
      <Canvas
        camera={{ position: [0, 4.6, 8], fov: 48, near: 0.1, far: 80 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
      >
        <RunnerStage
          activeEncounter={activeEncounter}
          isPaused={isPaused}
          onEncounterReady={setActiveEncounter}
          onNpcClick={() => setIsStoryOpen(true)}
        />
      </Canvas>

      <div className="adventure-runner__hud">
        <span>{activeEncounter ? '遇见新伙伴' : '正在向森林深处奔跑'}</span>
        <strong>{finishedEncounters}/3</strong>
      </div>

      {activeEncounter && !isStoryOpen ? (
        <button
          type="button"
          className="adventure-runner__npc-hint"
          onClick={() => setIsStoryOpen(true)}
        >
          点击 {activeEncounter.npcName}
        </button>
      ) : null}

      {activeEncounter && isStoryOpen ? (
        <div className="adventure-runner__dialogue" role="dialog" aria-modal="true">
          <p>{activeEncounter.npcName}</p>
          <h2>{activeEncounter.title}</h2>
          <span>{activeEncounter.dialogue}</span>
          <div className="adventure-runner__choices">
            {activeEncounter.options.map((option) => (
              <button key={option} type="button" onClick={continueExploring}>
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
