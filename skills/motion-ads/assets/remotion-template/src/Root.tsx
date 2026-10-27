import { Composition } from "remotion";
import { Hero, type HeroProps } from "./Hero";
import props from "../props.json";

const defaultProps = props as HeroProps;

export const Root = () => (
  <Composition
    id="Hero"
    component={Hero}
    durationInFrames={150}
    fps={30}
    width={1200}
    height={720}
    defaultProps={defaultProps}
    calculateMetadata={({ props }) => ({
      width: props.width,
      height: props.height,
      durationInFrames: Math.max(1, Math.round(props.durationSeconds * 30)),
    })}
  />
);
