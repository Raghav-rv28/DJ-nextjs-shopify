"use client";
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

  const beforeParams = new URLSearchParams(searchParams);
  const afterParams = new URLSearchParams(searchParams);
  if(afterParams.has("after")) { 
    console.log("im here");
    afterParams.delete('after');
    afterParams.append("after", pageInfo.endCursor);
  } else if(!afterParams.has("before") && pageInfo.hasNextPage) { 
    afterParams.append("after", pageInfo.endCursor);
  } else if(afterParams.has("before") && pageInfo.hasNextPage) { 
    afterParams.delete("before");
    afterParams.append("after", pageInfo.endCursor);
  }

  if(beforeParams.has("before")) { 
    beforeParams.delete('before');
    beforeParams.append("before", pageInfo.startCursor);
  } else if(!beforeParams.has("after") && pageInfo.hasPreviousPage) { 
    beforeParams.append("before", pageInfo.startCursor);
  } else if(beforeParams.has("after") && pageInfo.hasPreviousPage) { 
    beforeParams.delete("after");
    beforeParams.append("before", pageInfo.startCursor);
  }
  return (
    <div className="md:ml-2 flex justify-center items-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem className='mr-5'>
            <PaginationPrevious href={createUrl(pathname,beforeParams)} />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href={createUrl(pathname,afterParams)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}