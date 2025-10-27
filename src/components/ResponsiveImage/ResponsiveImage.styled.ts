import styled from "styled-components";
import { deviceMinWidth } from "../../breakpoints";

export const StyledResponsiveImage = styled.img<{
  mobileImage?: string;
  tabletImage?: string;
  laptopImage?: string;
  laptopLImage?: string;
  desktopImage?: string;
}>`
  max-width: 100%;
  max-height: 100%;
  content: url(${(props) => props.laptopImage});

  @media ${deviceMinWidth.mobile} {
    content: url(${(props) => props.mobileImage});
  }

  @media ${deviceMinWidth.tablet} {
    content: url(${(props) => props.tabletImage});
  }

  @media ${deviceMinWidth.laptop} {
    content: url(${(props) => props.laptopImage});
  }

  @media ${deviceMinWidth.laptopL} {
    content: url(${(props) => props.laptopLImage});
  }

  @media ${deviceMinWidth.desktop} {
    content: url(${(props) => props.desktopImage});
  }
`;
