'use client';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious
} from 'components/ui/pagination';
import { createUrl } from 'lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';
export default function PaginationComponent({
  pageInfo
}: {
  pageInfo: {
    endCursor: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
  };
}) {
  
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const params = new URLSearchParams(searchParams);
  if(params.has("after")) { 
    params.delete('after');
    params.append("after", pageInfo.endCursor);
  } else { 
    
    params.append("after", pageInfo.endCursor);
  }
  return (
    <div className="md:ml-2 flex justify-center items-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem className='mr-5'>
            <PaginationPrevious href='#' />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href={createUrl(pathname,params)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}