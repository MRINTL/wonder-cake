export default function CmsRoot() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: '4rem', color: '#071a3b' }}>
      <h1 style={{ color: '#e20b6c' }}>WonderCake CMS</h1>
      <p>
        Адмінка: <a href="/admin">/admin</a> · REST API: <a href="/api/products">/api/products</a>
      </p>
      <p>Вітрина працює окремо на <a href="http://localhost:4321">localhost:4321</a>.</p>
    </main>
  )
}
