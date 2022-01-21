import { select } from "@querycap-ui/core";
import { Link } from "@reactorx/router";
import { ReactNode } from "react";


export interface IBreadcrumbRoute {
    to: string;
    name: string
}

export interface BreadcrumbProp {
    separator?: ReactNode;
    routes: IBreadcrumbRoute[]
}



export const Breadcrumb = ({ separator = '/', routes, ...props }: BreadcrumbProp) => {
    const lastRoute = routes.slice(-1)[0];

    return <div {...props} css={select().display('flex').alignItems('center')}>
        {routes.slice(0, -1).map(e =>
            <BreadcrumbItem to={e.to} separator={separator} key={e.to}>
                {e.name}
            </BreadcrumbItem>
        )}
        <span>{lastRoute.name}</span>
    </div>
}


export const BreadcrumbItem = ({ to, separator, children }: { to: string; separator: ReactNode; children: ReactNode }) => {

    return <span css={select().display('inline-flex')}>
        <Link to={to} css={select().color(t => t.colors.info).with(
            select('&:hover').color(t => t.colors.primary)
        )}>{children}</Link>
        <span css={select().marginX(5).display('inline-block').color(t => t.colors.info)}>{separator}</span>
    </span>
}



