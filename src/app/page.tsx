import { getHeroes } from '@/lib/content'
import { CounterPicker } from './components/CounterPicker'

const HomePage = async () => {
  const heroes = await getHeroes()

  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-4 pb-10 sm:px-6">
      <CounterPicker heroes={heroes} />
    </div>
  )
}

export default HomePage
