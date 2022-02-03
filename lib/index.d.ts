

interface StorageProps {
  filename: string,
  initialValue?: T,
  beautyJsonParse?:boolean
}

function Storage<T>({filename, initialValue, beautyJsonParse}: StorageProps<T>): T extends Array ? T[] : T