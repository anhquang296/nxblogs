import Logo from '@/components/logo'

type Props = {
  lang: string
}

const CustomHeader = async ({ lang }: Props) => {
  return (
    <div className="custom-header flex items-center justify-between mb-10">
      <div className="flex items-center gap-2">
        <Logo />
        <span className="font-bold">Aiden Tran</span>
      </div>
    </div>
  )
}

export default CustomHeader
