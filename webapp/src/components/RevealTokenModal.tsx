import { FC, useMemo, useState } from "react";
import { Modal, ModalProps } from "./Modal";
import { useVenomWallet } from "../hooks/useVenomWallet";
import { InputWrapper } from "./InputWrapper";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import CodeEditor from "@uiw/react-textarea-code-editor";
import "@uiw/react-textarea-code-editor/dist.css";
import classNames from "classnames";
import { useCollectionContract } from "../hooks/useCollectionContract";
import { useParams } from "react-router-dom";
import { toNano } from "../utils/toNano";
import { RevealedTokenDto, createRevealedToken } from "../api/collections";
import { useCollectionInfo } from "../hooks/useCollectionInfo";
import { toast } from "react-toastify";

interface Form {
  tokenId: string;
  json: string;
}

const INITIAL_JSON = `{
  "type": "Basic NFT",
  "name": "Sample Name",
  "description": "Sample Description",
  "preview": {
      "source": "",
      "mimetype": ""
  },
  "files": [
      {
          "source": "",
          "mimetype": ""
      }
  ],
  "external_url": ""
}`;

export const RevealTokenModal: FC<ModalProps & { onFinish: () => void }> = (
  props
) => {
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();
  const collection = useCollectionContract(slug);
  const { data: info } = useCollectionInfo(slug);
  const { accountInteraction } = useVenomWallet();
  const createMutation = useMutation({
    mutationFn: (data: RevealedTokenDto) => createRevealedToken(slug!, data),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setError,
    formState: { errors }
  } = useForm<Form>({
    defaultValues: {
      json: INITIAL_JSON,
    },
  });

  const onSubmit = async (data: Form) => {
    if (!info) {
      toast.error('Could not retrieve collection info');
      return;
    }
    const tokenId = parseInt(data.tokenId);
    if (isNaN(tokenId)) {
      setError('tokenId', { message: 'Token ID should be a number' });
      return;
    }
    if (tokenId >= parseInt(info.totalSupply)) {
      setError('tokenId', { message: `Token ID not minted. Current supply: ${info.totalSupply}` });
      return;
    }
    if (!collection) {
      return;
    }

    setLoading(true);

    const { nft: nftAddress } = await collection.methods
      .nftAddress({
        answerId: 0,
        id: data.tokenId,
      })
      .call();
    await collection?.methods
      .revealToken({
        ...data,
      })
      .send({ from: accountInteraction!.address, amount: toNano("0.1") });
    let name;
    let imageUrl;
    try {
      const metadata = JSON.parse(data.json);
      name = metadata?.name;
      imageUrl = metadata?.preview?.source;
      // eslint-disable-next-line no-empty
    } catch (error) {}
    await createMutation.mutateAsync({
      tokenId: parseInt(data.tokenId),
      address: nftAddress.toString(),
      name,
      imageUrl,
      metadataJson: data.json,
    });
    reset({
      json: "",
      tokenId: "",
    });
    props.onFinish();
    setLoading(false);
  };

  const watchedJson = watch("json");
  const validJson = useMemo(() => {
    try {
      JSON.parse(watchedJson);
      return true;
    } catch (error) { /* empty */ }
    return false;
  }, [watchedJson]);

  return (
    <Modal {...props}>
      <div className="p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputWrapper
            label="Token ID"
            description="Enter the token id you want to reveal"
            error={errors.tokenId?.message}
          >
            <input
              type="text"
              className="input input-bordered w-full"
              {...register("tokenId")}
            />
          </InputWrapper>
          <InputWrapper>
            <Controller
              name="json"
              control={control}
              rules={{ required: false }}
              render={({ field }) => (
                <CodeEditor
                  value={field.value}
                  language="json"
                  placeholder=""
                  onChange={field.onChange}
                  padding={15}
                  data-color-mode="dark"
                  style={{
                    fontSize: 16,
                    // backgroundColor: "#f5f5f5",
                    // fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                  }}
                />
              )}
            />
          </InputWrapper>
          <button
            type="submit"
            className={classNames("btn btn-primary btn-block", {
              loading,
            })}
            disabled={!validJson}
          >
            Reveal Token
          </button>
        </form>
      </div>
    </Modal>
  );
};
