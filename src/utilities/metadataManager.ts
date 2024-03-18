import { StorageReference, SettableMetadata, updateMetadata } from 'firebase/storage'

const metadataBlob = `DSC_0837.jpg,2023:11:18 02:40:05,20s,f4.0,58.0mm,8000ISO
PNS_0109.jpg,2022:08:03 20:27:27,1/800s,f7.1,70.0mm,640ISO
PNS_0146.jpg,2022:08:03 20:38:02,1/40s,f4.0,70.0mm,31ISO
PNS_0185.jpg,2022:08:03 20:48:41,1/125s,f4.0,70.0mm,100ISO
PNS_0192.jpg,2022:08:03 20:52:18,1/40s,f4.0,70.0mm,31ISO
PNS_1385.jpg,2022:08:14 21:19:07,1/80s,f4.0,70.0mm,31ISO
PNS_1395.jpg,2022:08:14 21:20:14,1/80s,f4.0,70.0mm,31ISO
PNS_1487.jpg,2022:08:14 21:36:18,1/100s,f4.0,70.0mm,400ISO
PNS_2404.JPG,2022:08:23 20:34:04,1/125s,f4.0,70.0mm,2500ISO
PNS_3575.jpg,2022:08:28 18:24:53,1/80s,f6.3,70.0mm,31ISO
PNS_4709.jpg,2022:09:18 17:40:17,1/200s,f4.0,70.0mm,31ISO
PNS_5522.jpg,2022:09:22 14:18:32,1/125s,f4.0,70.0mm,800ISO
PNS_5740.jpg,2022:09:22 16:43:03,1/50s,f13.0,24.0mm,64ISO
PNS_5803.jpg,2022:09:23 13:50:49,1/500s,f4.0,70.0mm,31ISO
PNS_5848.jpg,2022:09:23 19:18:00,1/50s,f4.0,70.0mm,4000ISO
PNS_6519.jpg,2022:09:26 15:03:51,1/500s,f4.0,57.0mm,31ISO
PNS_7005.jpg,2022:09:27 12:05:17,1/100s,f4.0,70.0mm,100ISO
PNS_7011.jpg,2022:09:27 12:05:31,1/100s,f4.0,70.0mm,100ISO
PNS_7025.jpg,2022:09:27 12:06:28,1/100s,f4.0,70.0mm,100ISO
PNS_7049.jpg,2022:09:27 12:16:06,1/250s,f5.6,70.0mm,250ISO
PNS_7124.jpg,2022:09:27 12:33:05,1/50s,f4.0,70.0mm,500ISO
PNS_8232.jpg,2022:09:27 14:21:37,1/320s,f6.3,45.0mm,31ISO
PNS_8276.jpg,2022:09:27 14:24:45,1/25s,f4.0,70.0mm,320ISO
PNS_8293.jpg,2022:09:27 14:27:10,1/200s,f4.0,70.0mm,1250ISO
PNS_8475.jpg,2022:09:27 14:54:13,1/50s,f4.0,70.0mm,80ISO
PNS_8995.jpg,2022:09:28 08:36:40,1/250s,f10.0,70.0mm,64ISO
PNS_9042.jpg,2022:09:28 09:00:33,1/250s,f8.0,70.0mm,64ISO
PNS_9089.jpg,2022:09:28 10:38:59,1/250s,f4.5,70.0mm,200ISO
PNS_9100.jpg,2022:09:28 10:40:35,1/250s,f4.5,70.0mm,200ISO
PNS_9426.jpg,2022:10:05 01:25:16,90s,f5.0,1524.0mm,31ISO
PNT_0281.jpg,2022:10:12 15:52:42,1/640s,f4.0,70.0mm,64ISO
PNT_1371.jpg,2022:10:20 14:04:21,1/1250s,f3.5,145.0mm,64ISO
PNU_0386.jpg,2023:04:15 19:10:08,1/800s,f4.0,54.0mm,2000ISO
PNU_0748.jpg,2023:04:27 19:20:59,1/100s,f2.8,200.0mm,64ISO
PNU_1169.jpg,2023:05:12 19:45:52,1/80s,f2.8,200.0mm,250ISO
PNU_1182.jpg,2023:05:12 19:46:18,1/80s,f2.8,200.0mm,220ISO
PNU_1213.jpg,2023:05:12 19:46:38,1/80s,f2.8,200.0mm,280ISO
PNU_1220.jpg,2023:05:12 19:46:56,1/80s,f2.8,200.0mm,320ISO
PNU_1229.jpg,2023:05:12 19:47:41,1/80s,f2.8,200.0mm,320ISO
PNU_1579.jpg,2023:05:14 06:12:21,1/200s,f2.8,200.0mm,250ISO
PNU_1722.jpg,2023:05:14 06:59:21,1/1000s,f2.8,200.0mm,64ISO
PNU_1914.jpg,2023:05:21 19:27:31,1/1600s,f2.8,200.0mm,1600ISO
PNU_1987.jpg,2023:05:21 19:44:09,1/1600s,f2.8,70.0mm,140ISO
PNU_2109.jpg,2023:05:22 19:39:46,1/2000s,f2.8,200.0mm,2200ISO
PNU_2230.jpg,2023:05:22 19:54:30,1/2000s,f2.8,200.0mm,7200ISO
PNU_2819.jpg,2023:06:06 20:02:22,1/200s,f2.8,200.0mm,640ISO
PNU_2872.jpg,2023:06:07 16:42:39,1/640s,f8.0,155.0mm,64ISO
PNU_3107.jpg,2023:06:10 12:43:33,1/200s,f4.0,70.0mm,64ISO
PNU_3441.jpg,2023:06:10 20:28:22,1/2500s,f2.8,200.0mm,20000ISO
PNU_4895.jpg,2023:07:06 18:48:42,1/4000s,f5.6,400.0mm,2000ISO
PNU_5391.jpg,2023:07:17 20:55:03,1/125s,f8.0,140.0mm,140ISO
PNU_6565.jpg,2023:08:17 20:19:04,1/250s,f4.0,70.0mm,64ISO
PNU_7074.jpg,2023:09:05 19:32:38,1/500s,f5.6,400.0mm,7200ISO
PNU_7142.jpg,2023:09:05 19:48:05,1/200s,f2.8,200.0mm,80ISO
PNU_7277.jpg,2023:09:07 10:37:53,1/8000s,f5.6,400.0mm,1100ISO
PNU_7369.jpg,2023:09:08 18:07:17,1/5000s,f5.6,400.0mm,2200ISO
PNU_7397.jpg,2023:09:08 18:17:02,1/5000s,f5.6,400.0mm,2000ISO
PNU_7513.jpg,2023:09:10 18:41:58,1/1000s,f5.6,140.0mm,160ISO
PNU_8095.jpg,2023:09:23 18:39:46,1/200s,f8.0,400.0mm,280ISO
PNU_8168.jpg,2023:09:24 06:59:49,1/60s,f4.0,24.0mm,1000ISO
PNU_8174.jpg,2023:09:24 07:04:04,1/60s,f4.0,24.0mm,125ISO
PNU_8211.jpg,2023:09:24 07:29:32,1/60s,f22.0,86.0mm,64ISO
PNU_8231.jpg,2023:09:24 07:41:17,1/200s,f14.0,200.0mm,140ISO
PNU_8343.jpg,2023:09:24 11:45:47,1/200s,f4.0,34.5mm,80ISO
PNU_8747.jpg,2023:10:08 16:25:02,1/2500s,f4.0,70.0mm,3200ISO
PNU_8810.jpg,2023:10:08 16:37:42,1/2500s,f4.0,33.0mm,22800ISO
PNU_8863.jpg,2023:10:08 18:21:28,1/60s,f4.0,55.0mm,1800ISO
PNU_8879.jpg,2023:10:14 10:32:30,1/320s,f5.0,0.0mm,64ISO
PNU_9083.jpg,2023:10:17 18:54:41,1/60s,f4.0,70.0mm,400ISO
PNU_9517.jpg,2023:10:22 16:13:47,1/200s,f5.6,400.0mm,72ISO
PNU_9520.jpg,2023:10:22 16:17:33,1/1250s,f5.6,400.0mm,800ISO
PNU_9626.jpg,2023:10:22 18:20:15,1/200s,f4.0,24.0mm,2800ISO
PNU_9657.jpg,2023:10:22 18:25:47,1/200s,f4.0,24.5mm,5000ISO
PNU_9693.jpg,2023:10:26 15:05:52,1/2000s,f5.6,200.0mm,180ISO
PNV_0352.jpg,2023:11:18 03:17:40,1/2s,f5.0,0.0mm,400ISO
PNV_1717.jpg,2023:12:03 09:59:54,1/1000s,f5.6,400.0mm,560ISO
PNV_2543.jpg,2023:12:16 08:42:49,1/60s,f4.0,24.0mm,450ISO
PNV_2563.jpg,2023:12:16 08:51:54,1/100s,f4.0,24.0mm,250ISO
PNV_2877.jpg,2023:12:16 11:16:42,1/2000s,f5.6,400.0mm,320ISO
PNV_3658.jpg,2023:12:24 09:38:23,1/400s,f5.6,140.0mm,64ISO
PNV_3971.jpg,2023:12:31 10:42:02,1/2s,f22.0,34.5mm,64ISO
PNV_4584.jpg,2024:01:04 11:46:11,1/1250s,f2.8,140.0mm,200ISO
PNV_6119.jpg,2024:02:10 11:52:06,1/2000s,f8.0,400.0mm,450ISO`

type MetadataObject = {
  name: string
  dateCreated: string
  exposure: string
  aperture: string
  focalLength: string
  iso: string
  description: string
}

export class MetadataManager {
  static async setMetadata (item: StorageReference) {
    const metadataArray: Array<MetadataObject> = this.parseMetadata()
    const metadataObject: MetadataObject | undefined = metadataArray.find((element: MetadataObject) => {
      return item.name === element.name
    })
    const updatedMetadata: SettableMetadata = {
      customMetadata: {
        name: metadataObject?.name ?? '',
        dateCreated: metadataObject?.dateCreated ?? '',
        exposure: metadataObject?.exposure ?? '',
        aperture: metadataObject?.aperture ?? '',
        focalLength: metadataObject?.focalLength ?? '',
        iso: metadataObject?.iso ?? '',
        description: metadataObject?.description ?? ''
      }
    }
    await updateMetadata(item, updatedMetadata)
  }

  static parseMetadata (): Array<MetadataObject> {
    const metadataObj: Array<MetadataObject> = []
    const lines: string[] = metadataBlob.split('\n')
    lines.forEach((line: string) => {
      const columns: string[] = line.split(',')
      console.log(`name: ${columns[0]}`)
      console.log(`dateCreated: ${columns[1]}`)
      console.log(`exposure: ${columns[2]}`)
      console.log(`aperture: ${columns[3]}`)
      console.log(`focalLength: ${columns[4]}`)
      console.log(`iso: ${columns[5]}`)
      console.log(`description: ${columns[6]}`)
      metadataObj.push({ name: columns[0], dateCreated: columns[1], exposure: columns[2], aperture: columns[3], focalLength: columns[4], iso: columns[5], description: columns[6] })
    })
    return metadataObj
  }
}
