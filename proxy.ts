import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { docsContentRoute, docsRoute } from '@/lib/shared';

const docsPath = docsRoute === '/' ? '' : docsRoute;

const { rewrite: rewriteDocs } = rewritePath(
  `${docsPath}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsPath}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
);

export default function proxy(request: NextRequest) {
  const result = rewriteSuffix(request.nextUrl.pathname);
  if (result) {
    return NextResponse.rewrite(new URL(result, request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    const result = rewriteDocs(request.nextUrl.pathname);

    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl), {
        // this URL has two representations, selected by `Accept`
        headers: { Vary: 'Accept' },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|images|og|llms|icon\\.svg|favicon\\.ico).*)'],
};
