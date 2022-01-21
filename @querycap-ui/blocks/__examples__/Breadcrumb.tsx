import { Breadcrumb } from "../Breadcrumb"

export const Breadcrumbs = () => {
    const routes = [
        {
            to: '/',
            name: '主页'
        },
        {
            to: '/Breadcrumb',
            name: '面包屑'
        }
    ]
    return <Breadcrumb routes={routes} />
}