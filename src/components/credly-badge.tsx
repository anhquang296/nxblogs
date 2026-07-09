interface CredlyBadgeProps {
  badgeId: string
  width?: number
  height?: number
}

export function CredlyBadge({ badgeId, width = 150, height = 270 }: CredlyBadgeProps) {
  return (
    <div className="my-8 flex justify-center">
      <iframe
        src={`https://www.credly.com/embedded_badge/${badgeId}`}
        width={width}
        height={height}
        title="Credly badge"
        className="border-0"
      />
    </div>
  )
}
