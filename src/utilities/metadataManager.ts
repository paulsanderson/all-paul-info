import { StorageReference, SettableMetadata, updateMetadata } from 'firebase/storage'

const metadataBlob = `DSC_0837|2023-11-18 02:40:05|20s|f4.0|58.0mm|8000ISO|When doing astrophotography and a passing car brings unwelcome light, it may as well be captured.|
PNS_0109|2022-08-03 20:27:27|1/800s|f7.1|70.0mm|640ISO|A colorful Fall sunset reflecting off Cattail Lake.|
PNS_0146|2022-08-03 20:38:02|1/40s|f4.0|70.0mm|31ISO|A colorful Fall sunset reflecting off Cattail Lake.|
PNS_0185|2022-08-03 20:48:41|1/125s|f4.0|70.0mm|100ISO|A colorful Fall sunset reflecting off Cattail Lake.|
PNS_0192|2022-08-03 20:52:18|1/40s|f4.0|70.0mm|31ISO|A colorful Fall sunset reflecting off Cattail Lake, while a handful of ducks call out to others passing overhead.|
PNS_1385|2022-08-14 21:19:07|1/80s|f4.0|70.0mm|31ISO|The Columbia River estuary at sunset. A handful of container ships are making their way upriver under the Astoria-Megler bridge, the river currents floating on the open ocean behind them.|
PNS_1395|2022-08-14 21:20:14|1/80s|f4.0|70.0mm|31ISO|The Columbia River estuary at sunset. A handful of container ships are making their way upriver under the Astoria-Megler bridge, the river currents floating on the open ocean behind them.|
PNS_2404|2022-08-23 20:34:04|1/125s|f4.0|70.0mm|2500ISO|A wildflower blowing in the wind with the Bozeman, MT skyline behind it.|
PNS_3575|2022-08-28 18:24:53|1/80s|f6.3|70.0mm|31ISO|A late-autumn wheat field and the northern Bridger mountains.|
PNS_4709|2022-09-18 17:40:17|1/200s|f4.0|70.0mm|31ISO|The view of the Bridgers from Peet's hill on a beautiful Fall day.|
PNS_5522|2022-09-22 14:18:32|1/125s|f4.0|70.0mm|800ISO|A flower in the lush gardens of San Diego's Balboa park.|
PNS_5740|2022-09-22 16:43:03|1/50s|f13.0|24.0mm|64ISO|A pair of roses in the lush gardens of San Diego's Balboa park.|
PNS_5803|2022-09-23 13:50:49|1/500s|f4.0|70.0mm|31ISO|A bottlenose dolphin jumping as a man wades into the waters of Mission Beach in San Diego.|
PNS_6519|2022-09-26 15:03:51|1/500s|f4.0|57.0mm|31ISO|A crooked tree, a crooked street, a cliff, y una casa precaria construida con cojones, San Diego.|
PNS_7005|2022-09-27 12:05:17|1/100s|f4.0|70.0mm|100ISO|A red panda yawning between naps at the San Diego Zoo.|
PNS_7011|2022-09-27 12:05:31|1/100s|f4.0|70.0mm|100ISO|A red panda between naps at the San Diego Zoo.|
PNS_7025|2022-09-27 12:06:28|1/100s|f4.0|70.0mm|100ISO|A red panda napping at the San Diego Zoo.|
PNS_7049|2022-09-27 12:16:06|1/250s|f5.6|70.0mm|250ISO|A pair of green monkeys cuddling at the San Diego Zoo.|
PNS_7124|2022-09-27 12:33:05|1/50s|f4.0|70.0mm|500ISO|A saltwater crocodile sunbathing at the San Diego Zoo.|
PNS_8232|2022-09-27 14:21:37|1/320s|f6.3|45.0mm|31ISO|Two children playing with a bubble blower at the San Diego Zoo.|
PNS_8276|2022-09-27 14:24:45|1/25s|f4.0|70.0mm|320ISO|A pit viper lurking at the San Diego Zoo.|
PNS_8293|2022-09-27 14:27:10|1/200s|f4.0|70.0mm|1250ISO|A green iguana soaking up heat at the San Diego Zoo.|
PNS_8475|2022-09-27 14:54:13|1/50s|f4.0|70.0mm|80ISO|A komodo dragon drooling at the San Diego Zoo.|
PNS_8995|2022-09-28 08:36:40|1/250s|f10.0|70.0mm|64ISO|A tempestuous blanket of clouds seen from above.|
PNS_9042|2022-09-28 09:00:33|1/250s|f8.0|70.0mm|64ISO|A solitary path navigating a maze of sharp ridgetops in the Sierra Nevadas.|
PNS_9089|2022-09-28 10:38:59|1/250s|f4.5|70.0mm|200ISO|A ferry departing into Puget Sound near Seattle.|
PNS_9100|2022-09-28 10:40:35|1/250s|f4.5|70.0mm|200ISO|Downtown Seattle and the North Cascade mountains.|
PNS_9426|2022-10-05 01:25:16|90s|f5.0|1524.0mm|31ISO|Jupiter and its Galilean moons, created by stacking 12,000 photos taken with a large telescope over a 90 second period.|
PNT_0281|2022-10-12 15:52:42|1/640s|f4.0|70.0mm|64ISO|An array of Fall colors paint a hillside in the Painted Hills area of Bozeman.|
PNT_1371|2022-10-20 14:04:21|1/1250s|f3.5|145.0mm|64ISO|Late Fall colors adorning the headwaters of the Missouri River.|
PNU_0386|2023-04-15 19:10:08|1/800s|f4.0|54.0mm|2000ISO|Flames taking shape in a cozy backyard fire.|
PNU_0748|2023-04-27 19:20:59|1/100s|f2.8|200.0mm|64ISO|Spring comes much earlier to the fields of Bozeman than it does to the Spanish peaks.|
PNU_1169|2023-05-12 19:45:52|1/80s|f2.8|200.0mm|250ISO|A yellow-headed blackbird scrutinizing its photographer.|
PNU_1182|2023-05-12 19:46:18|1/80s|f2.8|200.0mm|220ISO|A yellow-headed blackbird striking a pose in its favorite habitat, a thick bed of cattails.|
PNU_1220|2023-05-12 19:46:56|1/80s|f2.8|200.0mm|320ISO|A yellow-headed blackbird calling out amid peak mating season.|
PNU_1579|2023-05-14 06:12:21|1/200s|f2.8|200.0mm|250ISO|A young moose mid-molt having breakfast in the marshy floodplains of the Missouri River headwaters.|
PNU_1722|2023-05-14 06:59:21|1/1000s|f2.8|200.0mm|64ISO|A blanket of fog hugging the northern Madison mountain range, seen from the Missouri River headwaters.|
PNU_1914|2023-05-21 19:27:31|1/1600s|f2.8|200.0mm|1600ISO|A yellow-headed blackbird taking to flight.|
PNU_1987|2023-05-21 19:44:09|1/1600s|f2.8|70.0mm|140ISO|A smoky, early sunset over Cattail Lake.|
PNU_2109|2023-05-22 19:39:46|1/2000s|f2.8|200.0mm|2200ISO|A pair of Canadian geese chattering as they glide around Cattail Lake.|
PNU_2230|2023-05-22 19:54:30|1/2000s|f2.8|200.0mm|7200ISO|An osprey in futile search of fish, briefly turning Cattail Lake into a giant birdbath.|
PNU_2819|2023-06-06 20:02:22|1/200s|f2.8|200.0mm|640ISO|A velvety, verdant field and the crisp, cold Gallatin mountains.|
PNU_2872|2023-06-07 16:42:39|1/640s|f8.0|155.0mm|64ISO|A traffic jam on the Spanish Peaks culminating in a Cumulonimbus cloud.|
PNU_3107|2023-06-10 12:43:33|1/200s|f4.0|70.0mm|64ISO|An old train tunnel on the Hiawatha bike trail.|
PNU_3441|2023-06-10 20:28:22|1/2500s|f2.8|200.0mm|20000ISO|The quintessential camping activity: roasting marshmellows.|
PNU_4895|2023-07-06 18:48:42|1/4000s|f5.6|400.0mm|2000ISO|Baby ducks snacking and quacking in equal amounts.|
PNU_5391|2023-07-17 20:55:03|1/125s|f8.0|140.0mm|140ISO|Water is often a perfect photography subject, uniquely combining light and motion, while the water wheel harkens back to earlier eras.|
PNU_6565|2023-08-17 20:19:04|1/250s|f4.0|70.0mm|64ISO|A smoky, early sunset over Cattail Lake.|
PNU_7074|2023-09-05 19:32:38|1/500s|f5.6|400.0mm|7200ISO|A cedar waxwing taking a brief break from frenetically building a nest.|
PNU_7142|2023-09-05 19:48:05|1/200s|f2.8|200.0mm|80ISO|A row of power poles disappearing over the horizon, while the sun does the same.|
PNU_7277|2023-09-07 10:37:53|1/8000s|f5.6|400.0mm|1100ISO|A bumblebee gracefully flitting between flowers, packing on pollen.|
PNU_7369|2023-09-08 18:07:17|1/5000s|f5.6|400.0mm|2200ISO|A Canadian goose drying off after landing.|
PNU_7397|2023-09-08 18:17:02|1/5000s|f5.6|400.0mm|2000ISO|A Canadian goose touching down.|
PNU_7513|2023-09-10 18:41:58|1/1000s|f5.6|140.0mm|160ISO|A flock of birds feasting in a Fall field.|
PNU_8095|2023-09-23 18:39:46|1/200s|f8.0|400.0mm|280ISO|An oily muskrat and its wake.|
PNU_8168|2023-09-24 06:59:49|1/60s|f4.0|24.0mm|1000ISO|A stunning sunrise at the headwaters of the Missouri River.|
PNU_8174|2023-09-24 07:04:04|1/60s|f4.0|24.0mm|125ISO|A stunning sunrise at the headwaters of the Missouri River.|
PNU_8211|2023-09-24 07:29:32|1/60s|f22.0|86.0mm|64ISO|A foggy Fall morning at the headwaters of the Missouri River.|
PNU_8231|2023-09-24 07:41:17|1/200s|f14.0|200.0mm|140ISO|A foggy Fall morning at the headwaters of the Missouri River.|
PNU_8343|2023-09-24 11:45:47|1/200s|f4.0|34.5mm|80ISO|The light at the end of the tunnel.|
PNU_8747|2023-10-08 16:25:02|1/2500s|f4.0|70.0mm|3200ISO|My dog realizing he has passed the point of no return and that I am too far away.|
PNU_8810|2023-10-08 16:37:42|1/2500s|f4.0|33.0mm|22800ISO|My dog crossing Crow Creek on a natural bridge.|
PNU_8863|2023-10-08 18:21:28|1/60s|f4.0|55.0mm|1800ISO|A layer of moss coating a granite boulder above Crow Creek.|
PNU_8879|2023-10-14 10:32:30|1/320s|f5.0|1524.0mm|64ISO|A partial solar eclipse, taken with a solar filter and telescope.|
PNU_9083|2023-10-17 18:54:41|1/60s|f4.0|70.0mm|400ISO|The sun and crescent moon setting over a field in Bozeman.|
PNU_9517|2023-10-22 16:13:47|1/200s|f5.6|400.0mm|72ISO|A late-season wildflower high on Sacagawea Peak.|
PNU_9520|2023-10-22 16:17:33|1/1250s|f5.6|400.0mm|800ISO|A curious, young mountain goat on Sacagawea Peak.|
PNU_9626|2023-10-22 18:20:15|1/200s|f4.0|24.0mm|2800ISO|My dog enjoying the enchanting view of Fairy Lake in the Bridger mountains.|
PNU_9657|2023-10-22 18:25:47|1/200s|f4.0|24.5mm|5000ISO|The stillness of the rope swing is reflected in the stillness of the lake.|
PNU_9693|2023-10-26 15:05:52|1/2000s|f5.6|200.0mm|180ISO|A pair of magpies battling over my dog's bone in the back yard.|
PNV_0352|2023-11-18 03:17:40|1/2s|f5.0|1524.0mm|400ISO|The Orion nebula taken with a telescope from my back yard.|
PNV_1717|2023-12-03 09:59:54|1/1000s|f5.6|400.0mm|560ISO|A pair of curious northern river otters at the headwaters of the Missouri River.|
PNV_2543|2023-12-16 08:42:49|1/60s|f4.0|24.0mm|450ISO|A winter sunrise at the headwaters of the Missouri River.|
PNV_2563|2023-12-16 08:51:54|1/100s|f4.0|24.0mm|250ISO|A winter sunrise at the headwaters of the Missouri River.|
PNV_2877|2023-12-16 11:16:42|1/2000s|f5.6|400.0mm|320ISO|A bald eagle flying low over the Missouri River.|
PNV_3658|2023-12-24 09:38:23|1/400s|f5.6|140.0mm|64ISO|A thick foggy morning blots out the sun at the headwaters of the Missouri River.|
PNV_3971|2023-12-31 10:42:02|1/2s|f22.0|34.5mm|64ISO|The frigid rapids of the Madison River.|
PNV_4584|2024-01-04 11:46:11|1/1250s|f2.8|140.0mm|200ISO|A four-year-old, 1100 pound Alaskan Brown Bear named Max at a rescue center near Livingston, Montana.|
PNV_6119|2024-02-10 11:52:06|1/2000s|f8.0|400.0mm|450ISO|A mature bald eagle overlooking the Madison River.|`

type MetadataObject = {
  name: string
  dateCreated: string
  exposure: string
  aperture: string
  focalLength: string
  iso: string
  description: string
  storeURL: string
}

export class MetadataManager {
  // TODO: store metadata in cloud database
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
        description: metadataObject?.description ?? '',
        storeURL: metadataObject?.storeURL ?? ''
      }
    }
    await updateMetadata(item, updatedMetadata)
  }

  static parseMetadata (): Array<MetadataObject> {
    const metadataObj: Array<MetadataObject> = []
    const lines: string[] = metadataBlob.split('\n')
    lines.forEach((line: string) => {
      const columns: string[] = line.split('|')
      metadataObj.push({
        name: columns[0],
        dateCreated: columns[1],
        exposure: columns[2],
        aperture: columns[3],
        focalLength: columns[4],
        iso: columns[5],
        description: columns[6],
        storeURL: columns[7]
      })
    })
    return metadataObj
  }
}
