export default async function Profile({ params }: { params: { username: string } }) {
  return <div>{params.username}</div>;
}
