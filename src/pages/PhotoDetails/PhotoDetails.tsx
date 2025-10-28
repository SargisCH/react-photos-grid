import { useParams } from "react-router-dom";
import { useQuery } from "../../hooks/useQuery";
import { getPhotoDetails } from "../../services/photoService/photoService";
import { useCallback } from "react";
import {
  StyledContainer,
  StyledDetails,
  StyledImageContainer,
} from "./PhotoDetails.styled";
import Loader from "../../components/Loader";
import ResponsiveImage from "../../components/ResponsiveImage/ResponsiveImage";
import {
  LoaderContainer,
  LoaderOverlay,
} from "../../components/Loader/Loader.styled";
import useImagePreloader from "../../hooks/useImagePreloader/useImagePreloader";

export default function PhotoDetails() {
  const { id } = useParams();

  const getPhotoDetailsCallback = useCallback(() => {
    if (!id) return Promise.resolve(null);
    return getPhotoDetails(Number(id));
  }, [id]);

  const { data, isLoading, isFetched } = useQuery({
    queryKey: ["photos", id],
    queryFn: getPhotoDetailsCallback,
  });
  const imageReady = useImagePreloader([
    data?.src.large ?? "",
    data?.src.large2x ?? "",
  ]);
  if (isLoading || !imageReady)
    return (
      <LoaderOverlay>
        <LoaderContainer>
          <Loader width={500} />
        </LoaderContainer>
      </LoaderOverlay>
    );
  if (!data && !isLoading && isFetched) {
    return <p>Not Found</p>;
  }
  return (
    <StyledContainer>
      <StyledImageContainer>
        <ResponsiveImage
          mobileImage={data?.src.large}
          tabletImage={data?.src.large}
          laptopImage={data?.src.large}
          laptopLImage={data?.src.large2x}
          desktopImage={data?.src.large2x}
          alt={data?.alt ?? `${data?.id} photo`}
        />
      </StyledImageContainer>
      <StyledDetails>
        <p>
          <strong>Photographer: </strong> {data?.photographer}
        </p>
        <p>
          <strong>Description: </strong> {data?.alt}
        </p>
        <p>
          <strong>Id: </strong> {id}
        </p>
        <p>
          <strong>Photographer url: </strong>
          <a target="_blank" href={data?.photographer_url}>
            {data?.photographer_url}
          </a>
        </p>
      </StyledDetails>
    </StyledContainer>
  );
}
