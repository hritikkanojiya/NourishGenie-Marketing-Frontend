/* eslint-disable react-hooks/exhaustive-deps */
import BlockUI from "@availity/block-ui";
import { BlockUiDesign } from "../../../common/components/blockUiDesign/BlockUiDesign";
import { useNavigate, useParams } from "react-router-dom";
import { ShortLinkService } from "../services/short_link.service";
import { useEffect } from "react";

export const ShortLinkComponent = () => {
  const navigate = useNavigate();
  const params: any = useParams();
  const url_id = params.id;

  const getOriginalUrl = async () => {
    const request = await ShortLinkService.readShortLink(url_id);
    if ("data" in request) {
      const url = new URL(request.data.redirectTo);
      navigate(`${url.pathname}${url.search}`);
    } else {
      navigate("/error/404");
    }
  };

  useEffect(() => {
    getOriginalUrl();
  }, []);

  return (
    <BlockUI
      blocking={true}
      className="overlay"
      loader={<BlockUiDesign />}
    ></BlockUI>
  );
};
