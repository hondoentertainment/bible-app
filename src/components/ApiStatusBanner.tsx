interface ApiStatusBannerProps {
  title: string
  detail: string
  stillWorks?: string
}

export function ApiStatusBanner({ title, detail, stillWorks }: ApiStatusBannerProps) {
  return (
    <div
      className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
      role="status"
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1 leading-relaxed">{detail}</p>
      {stillWorks && (
        <p className="mt-2 text-xs text-amber-900/90">
          <span className="font-semibold">Still works:</span> {stillWorks}
        </p>
      )}
    </div>
  )
}
