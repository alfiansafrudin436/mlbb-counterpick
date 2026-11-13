export const Footer = () => {
  return (
    <footer className="mx-auto w-full max-w-[1200px] px-4 pb-8 text-xs text-muted-foreground sm:px-6">
      Nama, role, dan gambar hero diambil dari API Mobile Legends. Data counter dikurasi manual di{' '}
      <code className="text-foreground">content/heroes.yaml</code> dan bisa berubah mengikuti patch.
      Proyek penggemar, tidak berafiliasi dengan Moonton.
    </footer>
  )
}
