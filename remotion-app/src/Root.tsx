import "./index.css";
import { Composition } from "remotion";
import { SuperheroBattle } from "./SuperheroBattle";
import { ProductShowcase } from "./ProductShowcase";

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
      <Composition
        id="ProductShowcase"
        component={ProductShowcase}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
