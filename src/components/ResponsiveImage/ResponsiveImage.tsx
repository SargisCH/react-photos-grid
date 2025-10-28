import { deviceMinWidth } from "../../breakpoints";
import { StyledResponsiveImage } from "./ResponsiveImage.styled";

type Props = {
  mobileImage?: string;
  tabletImage?: string;
  laptopImage?: string;
  laptopLImage?: string;
  desktopImage?: string;
  alt: string;
};

export default function ResponsiveImage({
  desktopImage,
  laptopLImage,
  laptopImage,
  tabletImage,
  mobileImage,
  alt,
}: Props) {
  return (
    <picture>
      {desktopImage && (
        <source media={deviceMinWidth.desktop} srcSet={desktopImage} />
      )}
      {laptopLImage && (
        <source media={deviceMinWidth.laptopL} srcSet={laptopLImage} />
      )}
      {laptopImage && (
        <source media={deviceMinWidth.laptop} srcSet={laptopImage} />
      )}
      {tabletImage && (
        <source media={deviceMinWidth.tablet} srcSet={tabletImage} />
      )}
      {mobileImage && (
        <source media={deviceMinWidth.mobile} srcSet={mobileImage} />
      )}
      <StyledResponsiveImage
        src={tabletImage}
        alt={alt}
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </picture>
  );
}
