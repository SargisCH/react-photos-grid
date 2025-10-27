import { Link } from "react-router-dom";
import styled from "styled-components";

export const StyledImageCard = styled.img`
  border-radius: 15px;
  width: 100%;
  height: auto;
  user-select: none;
  pointer-events: none;
`;

export const StyledLink = styled(Link)`
  display: block;
`;
