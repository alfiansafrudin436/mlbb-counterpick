import { notFound } from 'next/navigation'
import { getHeroData } from '@/lib/content'
import { hasLocale } from '@/lib/i18n'
import { CounterPicker } from './components/CounterPicker'
import { getDictionary } from './dictionaries'

const HomePage = async ({ params }: PageProps<'/[lang]'>) => {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const [{ heroes, itemIcons }, { picker }] = await Promise.all([
    getHeroData(lang),
    getDictionary(lang),
  ])

  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-4 pb-10 sm:px-6">
      <CounterPicker heroes={heroes} itemIcons={itemIcons} dict={picker} />
    </div>
  )
}

export default HomePage
