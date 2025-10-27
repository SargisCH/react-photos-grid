import { StyledContainer, StyledLoader } from "./Loader.styled";

export default function Loader({ width }: { width: number }) {
  return (
    <StyledContainer>
      <StyledLoader $width={width} />
    </StyledContainer>
  );
}
