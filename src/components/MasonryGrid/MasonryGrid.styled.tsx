import styled from "styled-components";

export const MasonryColumns = styled.div<{ $width: number; $height: number }>`
  margin: 0 auto;
  position: relative;
  width: ${({ $width }) => $width + "px"};
  height: ${({ $height }) => $height + "px"};
`;

export const MasonryContainer = styled.div`
  height: 98vh;
  overflow-y: scroll;
`;

export const StyledItem = styled.div<{
  $top: number;
  $left: number;
  $width: number;
  $height: number;
}>`
  position: absolute;
  width: ${({ $width }) => $width + "px"};
  height: ${({ $height }) => $height + "px"};
  top: ${({ $top }) => $top + "px"};
  left: ${({ $left }) => $left + "px"};
  margin-bottom: 10px;
`;
