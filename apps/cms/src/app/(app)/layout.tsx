export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
