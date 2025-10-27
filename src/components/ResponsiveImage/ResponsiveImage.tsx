import { StyledResponsiveImage } from "./ResponsiveImage.styled";

type Props = {
  mobileImage?: string;
  tabletImage?: string;
  laptopImage?: string;
  laptopLImage?: string;
  desktopImage?: string;
};

export default function ResponsiveImage(props: Props) {
  return <StyledResponsiveImage {...props} />;
}
