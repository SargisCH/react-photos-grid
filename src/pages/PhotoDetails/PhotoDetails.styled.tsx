import styled from "styled-components";
import { deviceMaxWidth } from "../../breakpoints";

export const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px;

  @media ${deviceMaxWidth.tablet} {
    flex-direction: column;
    align-items: center;
  }
`;

export const StyledImageContainer = styled.div`
  height: 90vh;
  width: 70%;
  display: flex;
  justify-content: center;
`;

export const StyledDetails = styled.div`
  margin-left: 20px;
  @media ${deviceMaxWidth.tablet} {
    font-size: 14px;
  }
`;
