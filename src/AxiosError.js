export default function handleAxiosError(err) {
  window.scrollTo(0, 0);
  if (err.response) {
    const res = err.response;
    return res.data.err_msg ? res.data.err_msg
      : (res.status + " " + res.data.toString());
  } else
    return err.toString();
}