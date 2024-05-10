import { StorageReference, SettableMetadata, updateMetadata } from 'firebase/storage'

const metadataBlob = `DSC_0837|landscape,astro|2023-11-18 02:40:05|20s|f4.0|58.0mm|8000ISO|When doing astrophotography and a passing car brings unwelcome light, it may as well be captured. Bob Ross would refer to this tree as a Happy Little Accident.|happy-little-accident
PNS_0109|landscape|2022-08-03 20:27:27|1/800s|f7.1|70.0mm|640ISO|A colorful Fall sunset reflecting off Cattail Lake.|cattail-ripples
PNS_0146|wildlife,landscape|2022-08-03 20:38:02|1/40s|f4.0|70.0mm|31ISO|A colorful Fall sunset reflecting off Cattail Lake as a lone duckling leaves its wake rippling in the calm water.|duckling-sunset
PNS_0185|landscape|2022-08-03 20:48:41|1/125s|f4.0|70.0mm|100ISO|A warm Fall sunset reflecting off Cattail Lake.|cattail-on-fire
PNS_0192|wildlife,landscape|2022-08-03 20:52:18|1/40s|f4.0|70.0mm|31ISO|A beautiful Fall sunset creates a rich gradient of colors reflecting off Cattail Lake while a handful of ducks call out to others passing overhead.|cattail-ducks
PNS_1385|landscape|2022-08-14 21:19:07|1/80s|f4.0|70.0mm|31ISO|The winding Columbia River estuary at dusk. A handful of container ships have just passed upriver under the Astoria-Megler bridge. The freshwater river currents can be seen floating out to sea on the saline ocean for miles.|columbia-river-estuary
PNS_2404|macro|2022-08-23 20:34:04|1/125s|f4.0|70.0mm|2500ISO|A wild sunflower blowing in the breeze in Bozeman, Montana.|wild-sunflower
PNS_3575|landscape,street|2022-08-28 18:24:53|1/80s|f6.3|70.0mm|31ISO|A late-autumn wheat field stretches over rolling hills to the foot of the northern Bridger mountains. The road in the foreground shares a hint of the field's golden hues, but its straight lines demarcate a powerful boundary.|a-street-wheat-and-the-bridgers
PNS_4709|landscape|2022-09-18 17:40:17|1/200s|f4.0|70.0mm|31ISO|A panoramic view of dramatic light striking the Bridgers from Peet's hill on a beautiful Fall day.|the-bridgers-from-peets-hill
PNS_5522|macro|2022-09-22 14:18:32|1/125s|f4.0|70.0mm|800ISO|A cluster of pink hydrangea flowers in full bloom at the lush gardens of San Diego's Balboa park.|pink-hydrangea
PNS_5740|macro|2022-09-22 16:43:03|1/50s|f13.0|24.0mm|64ISO|A pair of pink and white roses in the lush gardens of San Diego's Balboa park.|pink-roses
PNS_5803|wildlife,landscape|2022-09-23 13:50:49|1/500s|f4.0|70.0mm|31ISO|A bottlenose dolphin jumping as a man wades into the waters of Mission Beach in San Diego.|bottlenose-surprise
PNS_6519|street|2022-09-26 15:03:51|1/500s|f4.0|57.0mm|31ISO|A crooked tree, a crooked street, a cliff, y una casa precaria construida con cojones, San Diego.|crooked-cliff-street
PNS_7005|wildlife|2022-09-27 12:05:17|1/100s|f4.0|70.0mm|100ISO|A red panda yawning between naps at the San Diego Zoo.|red-panda-yawn
PNS_7011|wildlife|2022-09-27 12:05:31|1/100s|f4.0|70.0mm|100ISO|A red panda between naps at the San Diego Zoo.|red-panda-goofiness
PNS_7025|wildlife|2022-09-27 12:06:28|1/100s|f4.0|70.0mm|100ISO|A red panda napping at the San Diego Zoo.|red-panda-nap
PNS_7124|wildlife|2022-09-27 12:33:05|1/50s|f4.0|70.0mm|500ISO|A saltwater crocodile sunbathing menacingly at the San Diego Zoo.|sunbathing-saltwater
PNS_8232|street|2022-09-27 14:21:37|1/320s|f6.3|45.0mm|31ISO|Two children playing with a bubble blower at the San Diego Zoo.|bubble-blower
PNS_8276|widllife|2022-09-27 14:24:45|1/25s|f4.0|70.0mm|320ISO|A pit viper lurking in the shadows at the San Diego Zoo.|pit-viper
PNS_8293|wildlife|2022-09-27 14:27:10|1/200s|f4.0|70.0mm|1250ISO|A green iguana lazily soaking up heat at the San Diego Zoo.|green-iguana-chilling
PNS_8475|wildlife|2022-09-27 14:54:13|1/50s|f4.0|70.0mm|80ISO|A Komodo dragon menacingly drooling at the San Diego Zoo.|drooling-dragon
PNS_8995|landscape|2022-09-28 08:36:40|1/250s|f10.0|70.0mm|64ISO|A tempestuous blanket of cumulus clouds seen from above.|tempestuous-blanket
PNS_9042|landscape|2022-09-28 09:00:33|1/250s|f8.0|70.0mm|64ISO|A solitary path navigating a maze of sharp ridgetops in the Sierra Nevadas.|maze-of-ridges
PNS_9089|landscape,street|2022-09-28 10:38:59|1/250s|f4.5|70.0mm|200ISO|A ferry departing into Puget Sound near Seattle.|puget-sound-ferry
PNS_9100|landscape,street|2022-09-28 10:40:35|1/250s|f4.5|70.0mm|200ISO|A view of downtown Seattle and the foggy North Cascade mountains.|seattle-and-the-cascade-range
PNT_0281|landscape|2022-10-12 15:52:42|1/640s|f4.0|70.0mm|64ISO|An array of Fall colors paint a forested hillside in the Painted Hills area of Bozeman.|painted-hills
PNU_0386|street|2023-04-15 19:10:08|1/800s|f4.0|54.0mm|2000ISO|Flames dancing in shapes create a Rorscach test out of a cozy backyard fire.|rorscach-flames
PNU_0748|landscape|2023-04-27 19:20:59|1/100s|f2.8|200.0mm|64ISO|Late winter in the Spanish Peaks as seen from early spring in Bozeman.|spanish-peaks-sunset
PNU_1169|wildlife|2023-05-12 19:45:52|1/80s|f2.8|200.0mm|250ISO|A yellow-headed blackbird scrutinizing its photographer.|blackbird-gaze
PNU_1182|wildlife|2023-05-12 19:46:18|1/80s|f2.8|200.0mm|220ISO|A yellow-headed blackbird striking a pose in its favorite habitat, a thick bed of cattails.|blackbird-posing
PNU_1220|wildlife|2023-05-12 19:46:56|1/80s|f2.8|200.0mm|320ISO|A yellow-headed blackbird calling out from the cattails amid peak mating season.|blackbird-calling
PNU_1579|wildlife|2023-05-14 06:12:21|1/200s|f2.8|200.0mm|250ISO|A young moose mid-molt having breakfast in the marshy floodplains of the Missouri River headwaters.|moose-breakfast
PNU_1722|landscape|2023-05-14 06:59:21|1/1000s|f2.8|200.0mm|64ISO|A blanket of fog hugging the snow-capped northern Madison mountain range, seen from the Missouri River headwaters.|cloudy-madison-mountains
PNU_1914|wildlife|2023-05-21 19:27:31|1/1600s|f2.8|200.0mm|1600ISO|A yellow-headed blackbird taking to flight from its cattail perch.|blackbird-leap
PNU_1987|landscape|2023-05-21 19:44:09|1/1600s|f2.8|70.0mm|140ISO|A smoky, early sunset over Cattail Lake gives way to a still-blue day above.|smoky-sunset
PNU_2109|wildlife|2023-05-22 19:39:46|1/2000s|f2.8|200.0mm|2200ISO|A pair of Canadian geese chattering as they glide around Cattail Lake at dusk.|geese-gliding
PNU_2230|wildlife|2023-05-22 19:54:30|1/2000s|f2.8|200.0mm|7200ISO|An osprey in futile search of fish, briefly turning Cattail Lake into a giant birdbath.|osprey-splash
PNU_2819|landscape|2023-06-06 20:02:22|1/200s|f2.8|200.0mm|640ISO|A velvety, verdant field and the crisp, cold Gallatin mountains.|green-fields-and-blue-hills
PNU_2872|landscape|2023-06-07 16:42:39|1/640s|f8.0|155.0mm|64ISO|A Cumulonimbus cloud has culminated due to a traffic jam on the Spanish Peaks.|cumulonimbus-on-the-spanish-peaks
PNU_3107|landscape,street|2023-06-10 12:43:33|1/200s|f4.0|70.0mm|64ISO|An old train tunnel on the Hiawatha bike trail into the thick forests surrounding it.|hiawatha-tunnel
PNU_3441|street|2023-06-10 20:28:22|1/2500s|f2.8|200.0mm|20000ISO|The quintessential camping activity: roasting marshmellows.|roasting-marshmellow
PNU_4895|wildlife|2023-07-06 18:48:42|1/4000s|f5.6|400.0mm|2000ISO|Ducklings snacking and quacking in equal amounts.|duckling-party
PNU_5391|landscape,street|2023-07-17 20:55:03|1/125s|f8.0|140.0mm|140ISO|Water wheels perfectly combining the elements of photography: light and motion. This simple farm implement harkens back to earlier eras.|water-wheel
PNU_6565|landscape|2023-08-17 20:19:04|1/250s|f4.0|70.0mm|64ISO|A smoky, early sunset casts warm colors across the sky, reflecting them in Cattail Lake.|smoky-sunset-reflection
PNU_7074|wildlife|2023-09-05 19:32:38|1/500s|f5.6|400.0mm|7200ISO|A cedar waxwing taking a brief break from frenetically building a nest.|cedar-waxwing-resting
PNU_7142|landscape,street|2023-09-05 19:48:05|1/200s|f2.8|200.0mm|80ISO|A row of power poles disappearing over the horizon, while the sun does the same.|power-pole-twilight
PNU_7277|wildlife,macro|2023-09-07 10:37:53|1/8000s|f5.6|400.0mm|1100ISO|A bumblebee gracefully flitting between flowers, packing on pollen. Its transparent wings look like stained glass.|bumblebee-mission
PNU_7369|wildlife|2023-09-08 18:07:17|1/5000s|f5.6|400.0mm|2200ISO|A Canadian goose drying off after landing. The setting sun adds a nice gradient to its feathers.|goose-flapping
PNU_7397|wildlife|2023-09-08 18:17:02|1/5000s|f5.6|400.0mm|2000ISO|A Canadian goose touching down, feet extended and wings outstretched.|goose-landing
PNU_7513|wildlife,landscape|2023-09-10 18:41:58|1/1000s|f5.6|140.0mm|160ISO|A flock of birds mid-flight after feasting in a Fall field.|feast-for-a-flock
PNU_8095|wildlife|2023-09-23 18:39:46|1/200s|f8.0|400.0mm|280ISO|An oily muskrat and its rippling wake.|muskrat-ripples
PNU_8168|landscape|2023-09-24 06:59:49|1/60s|f4.0|24.0mm|1000ISO|A stunning sunrise over the rolling hills carved out at the headwaters of the Missouri River.|sunrise-streaks
PNU_8174|landscape|2023-09-24 07:04:04|1/60s|f4.0|24.0mm|125ISO|A stunning sunrise over the headwaters of the Missouri River. The clouds rolled out as the fog rolled in and the sun rose.|missouri-river-sunrise
PNU_8211|landscape|2023-09-24 07:29:32|1/60s|f22.0|86.0mm|64ISO|A foggy Fall morning at the headwaters of the Missouri River.|missouri-river-mist
PNU_8231|wildlife,landscape|2023-09-24 07:41:17|1/200s|f14.0|200.0mm|140ISO|A bird cuts through the fog at dawn at the headwaters of the Missouri River.|missouri-river-misty-bird
PNU_8343|landscape,street|2023-09-24 11:45:47|1/200s|f4.0|34.5mm|80ISO|The light at the end of the tunnel is nature.|nature-tunnel
PNU_8747|landscape|2023-10-08 16:25:02|1/2500s|f4.0|70.0mm|3200ISO|The best dog realizing he has just passed the point of no return on a natural bridge and that his owner is too far away.|natural-bridge-crossing
PNU_8810|landscape|2023-10-08 16:37:42|1/2500s|f4.0|33.0mm|22800ISO|The best dog crossing Crow Creek on a natural bridge with colorful late-autumn leaves in the background.|crossing-crow-creek
PNU_8863|landscape|2023-10-08 18:21:28|1/60s|f4.0|55.0mm|1800ISO|A layer of verdant green moss coating a granite boulder above Crow Creek.|mossy-boulders
PNU_8879|astro|2023-10-14 10:32:30|1/320s|f5.0|1524.0mm|64ISO|A partial solar eclipse captured with a solar filter and telescope.|solar-eclipse
PNU_9083|landscape,astro|2023-10-17 18:54:41|1/60s|f4.0|70.0mm|400ISO|The sun and crescent moon both set over a dark green field in Bozeman.|moon-and-sunset
PNU_9517|macro|2023-10-22 16:13:47|1/200s|f5.6|400.0mm|72ISO|A late-season vibrant blue wildflower surviving high in the scrabble on Sacagawea Peak.|sacajawea-wildflower
PNU_9520|wildlife|2023-10-22 16:17:33|1/1250s|f5.6|400.0mm|800ISO|A curious, young mountain goat on Sacagawea Peak.|young-mountain-goat
PNU_9626|landscape|2023-10-22 18:20:15|1/200s|f4.0|24.0mm|2800ISO|The best dog enjoying a fading, enchanting view of Fairy Lake in the Bridger mountains as storms roll in.|enchanted-by-fairy-lake
PNU_9657|landscape|2023-10-22 18:25:47|1/200s|f4.0|24.5mm|5000ISO|The stillness of the rope swing is reflected in the stillness of Fairy Lake and the calm yet roiling clouds.|fairy-lake-swing
PNU_9693|wildlife|2023-10-26 15:05:52|1/2000s|f5.6|200.0mm|180ISO|A pair of magpies dueling over a dog's bone.|dog-bone-duel
PNV_0352|astro|2023-11-18 03:17:40|1/2s|f5.0|1524.0mm|400ISO|The Orion nebula sparkling in natural hues of blue and pink.|orion-nebula
PNV_1717|wildlife|2023-12-03 09:59:54|1/1000s|f5.6|400.0mm|560ISO|A pair of curious northern river otters at the headwaters of the Missouri River, one shaking itself dry.|curious-otters
PNV_2543|landscape|2023-12-16 08:42:49|1/60s|f4.0|24.0mm|450ISO|A vibrant winter sunrise at the headwaters of the Missouri River.|missouri-river-winter-sunrise
PNV_2563|landscape|2023-12-16 08:51:54|1/100s|f4.0|24.0mm|250ISO|A stunning winter sunrise at the headwaters of the Missouri River is contrasted by a dark, solitary tree.|missouri-river-tree-sunrise
PNV_2877|wildlife|2023-12-16 11:16:42|1/2000s|f5.6|400.0mm|320ISO|A bald eagle flying low over the Missouri River deep in winter.|bald-eagle-flying-low-over-the-missouri-river
PNV_3658|landscape|2023-12-24 09:38:23|1/400s|f5.6|140.0mm|64ISO|A thick morning fog blots out the sun deep in winter at the frosty headwaters of the Missouri River.|missouri-river-frost
PNV_3971|landscape|2023-12-31 10:42:02|1/2s|f22.0|34.5mm|64ISO|The frigid rapids of the Madison River in winter flowing over a slippery mid-river boulder.|madison-river-rapids
PNV_4584|wildlife|2024-01-04 11:46:11|1/1250s|f2.8|140.0mm|200ISO|A four-year-old, 1100 pound Alaskan Brown Bear named Max bearing a gentle expression at a rescue center in Montana.|brown-bear-smile
PNV_6119|wildlife|2024-02-10 11:52:06|1/2000s|f8.0|400.0mm|450ISO|A mature bald eagle majestically overlooks the Madison River from its snowy perch.|majestic-bald-eagle
PNV_7984|wildlife|2024-03-29 07:19:30|1/200s|f5.6|390.0mm|900ISO|A pair of American White Pelicans wake and stretch while the rest of their flock still sleeps. Migrating to their breeding grounds, the adult males have grown Nuptial Tubercles on their beaks to impress potential mates.|pelican-sunrise
PNW_0025|wildlife|2024-04-15 10:25:44|1/250s|f6.3|400.0mm|64ISO|A juvenile bald eagle stares intensely, looking grumpy in the Spring rain.|going-bald`

type MetadataObject = {
  name: string
  type: string
  date: string
  exposure: string
  aperture: string
  focalLength: string
  iso: string
  description: string
  title: string
}

export class MetadataManager {
  static async setMetadata (item: StorageReference) {
    const metadataArray: Array<MetadataObject> = this.parseMetadata()
    const metadataObject: MetadataObject | undefined = metadataArray.find((element: MetadataObject) => {
      return item.name === element.name + '.jpg'
    })
    const updatedMetadata: SettableMetadata = {
      customMetadata: {
        name: metadataObject?.name ?? '',
        type: metadataObject?.type ?? '',
        date: metadataObject?.date ?? '',
        exposure: metadataObject?.exposure ?? '',
        aperture: metadataObject?.aperture ?? '',
        focalLength: metadataObject?.focalLength ?? '',
        iso: metadataObject?.iso ?? '',
        description: metadataObject?.description ?? '',
        title: metadataObject?.title ?? ''
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
        type: columns[1],
        date: columns[2],
        exposure: columns[3],
        aperture: columns[4],
        focalLength: columns[5],
        iso: columns[6],
        description: columns[7],
        title: columns[8]
      })
    })
    return metadataObj
  }
}
