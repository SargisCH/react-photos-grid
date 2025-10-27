import { StyledLoader } from "./Loader.styled";

export default function Loader({ width }: { width?: number }) {
  return <StyledLoader $width={width} />;
}
