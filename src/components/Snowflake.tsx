import { SNOWFLAKE_PATH } from '../lib/snowflake'

type SnowflakeProps = {
  className?: string
}

/** 页脚等处的六角枝晶雪花图标（对齐 blog / resume） */
export default function Snowflake({ className }: SnowflakeProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
      <path d={SNOWFLAKE_PATH} />
    </svg>
  )
}
