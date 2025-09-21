import { Header } from "@/components/header"

type Props = {
    children: React.ReactNode
}

const DashboardLayout = ({children} : Props) => {

  return (
        <div className="debug min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        </div>
  )
}

export default DashboardLayout




