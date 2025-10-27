import styled, { keyframes } from "styled-components";

const loaderAnimation = keyframes`
  to{background-size: 100% 3px}
`;

export const StyledLoader = styled.div<{ $width?: number }>`
  width: ${({ $width }) => ($width ? $width + "px" : "100%")};
  font-weight: bold;
  font-family: sans-serif;
  font-size: 30px;
  padding-bottom: 8px;
  background: linear-gradient(currentColor 0 0) 0 100%/0% 3px no-repeat;
  animation: ${loaderAnimation} 2s infinite linear;
`;
