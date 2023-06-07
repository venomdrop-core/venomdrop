import React, { FC, useState } from 'react'
import { AdminLayout } from '../../../layouts/AdminLayout'
import { SparklesIcon } from '@heroicons/react/24/outline'
import { RevealTokenModal } from '../../../components/RevealTokenModal';
import { useQuery } from '@tanstack/react-query';
import { getRevealedTokens } from '../../../api/collections';
import { useParams } from 'react-router-dom';
import { RevealedTokenListingCard } from '../../../components/RevealedTokenListingCard';
import { LoadingBox } from '../../../components/LoadingBox';
import { toast } from 'react-toastify';

export interface RevealProps {
  
}

export const Reveal: FC<RevealProps> = (props) => {
  const { slug } = useParams();
  const [revealModalOpen, setRevealModalOpen] = useState(false);
  const { data: revealedTokens, refetch, isLoading } = useQuery({
    queryFn: () => getRevealedTokens(slug!, {
      limit: 50,
      skip: 0,
    })
  });
  const onAddRevealTokenFinish = () => {
    refetch();
    setRevealModalOpen(false);
    toast('Token Revealed!');
  }
  return (
    <AdminLayout>
      <RevealTokenModal open={revealModalOpen} setOpen={setRevealModalOpen} onFinish={onAddRevealTokenFinish} />
      <LoadingBox loading={isLoading}>
        <div className="p-16">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h1 className="text-2xl">Revealed NFTs</h1>
              <p className="mt-4 text-lg">
                Reveal the NFTs after the minting proccess
              </p>
            </div>
            <div>
              <button
                className="btn btn-primary mt-4 md:mt-0"
                onClick={() => setRevealModalOpen(true)}
              >
                <SparklesIcon className="w-5 h-5 mr-2" />
                Reveal Token
              </button>
            </div>
          </div>

          {revealedTokens && revealedTokens?.length > 0 ? (
            <div className="mt-8">
              <div className="grid grid-cols-3 gap-4">
                {(revealedTokens || []).map((revealedToken) => (
                  <div>
                    <RevealedTokenListingCard revealedToken={revealedToken} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-base-100 p-24 text-center rounded-md text-gray-500 mt-16">
              You haven't revealed any NFT yet
            </div>
          )}
        </div>
      </LoadingBox>
    </AdminLayout>
  )
}
