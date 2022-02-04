export default function Storage<T>({
  filename,
  initialValue,
  beautyJsonParse,
}: {
  filename: string;
  initialValue?: T;
  beautyJsonParse?: boolean;
}): unknown extends T ? any : T;
