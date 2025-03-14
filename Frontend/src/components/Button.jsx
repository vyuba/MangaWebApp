
function Button({ styles, info, }) {
  return (
    <button className={` ${styles} border-border bg-secondary border p-2 `}>
        {info}
    </button>
  )
}

export default Button