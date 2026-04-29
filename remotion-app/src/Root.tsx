import "./index.css";
import { Composition } from "remotion";
import { SuperheroBattle } from "./SuperheroBattle";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SuperheroBattle"
        component={SuperheroBattle}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
