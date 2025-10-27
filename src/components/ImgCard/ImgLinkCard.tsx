import { StyledImageCard, StyledLink } from "./ImgLinkCard.styled";

type Props = { src: string; alt: string; to: string };

export default function ImageLinkCard({ to, src, alt }: Props) {
  return (
    <StyledLink to={to}>
      <StyledImageCard src={src} alt={alt} />
    </StyledLink>
  );
}
