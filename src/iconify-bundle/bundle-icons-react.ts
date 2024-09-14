import { promises as fs } from 'fs'
import { dirname } from 'path'
import { importDirectory, cleanupSVG, parseColors, isEmptyColor, runSVGO } from '@iconify/tools'
import { getIcons, stringToIcon, minifyIconSet } from '@iconify/utils'
import type { IconifyJSON, IconifyMetaData } from '@iconify/types'

interface BundleScriptCustomSVGConfig {
  dir: string
  monotone: boolean
  prefix: string
}

interface BundleScriptCustomJSONConfig {
  filename: string
  icons?: string[]
}

interface BundleScriptConfig {
  svg?: BundleScriptCustomSVGConfig[]
  icons?: string[]
  json?: (string | BundleScriptCustomJSONConfig)[]
}

const sources: BundleScriptConfig = {
  json: [
    require.resolve('@iconify/json/json/tabler.json'),
    {
      filename: require.resolve('@iconify/json/json/mdi.json'),
      icons: ['star', 'heart', 'circle', 'github', 'google', 'twitter', 'facebook', 'star-outline', 'heart-outline']
    }
  ],
  svg: [
    {
      dir: 'src/iconify-bundle/svg',
      monotone: false,
      prefix: 'custom'
    }
  ]
}

const component = '@iconify/react'
const commonJS = false
const target = 'src/iconify-bundle/icons-bundle-react.js'

;(async function () {
  let bundle = commonJS
    ? "const { addCollection } = require('" + component + "');\n\n"
    : "import { addCollection } from '" + component + "';\n\n"

  const dir = dirname(target)
  try {
    await fs.mkdir(dir, {
      recursive: true
    })
  } catch (err) {}

  if (sources.icons) {
    const sourcesJSON = sources.json ? sources.json : (sources.json = [])

    const organizedList = organizeIconsList(sources.icons)
    for (const prefix in organizedList) {
      const filename = require.resolve(`@iconify/json/json/${prefix}.json`)
      sourcesJSON.push({
        filename,
        icons: organizedList[prefix]
      })
    }
  }

  if (sources.json) {
    for (let i = 0; i < sources.json.length; i++) {
      const item = sources.json[i]

      const filename = typeof item === 'string' ? item : item.filename
      let content = JSON.parse(await fs.readFile(filename, 'utf8')) as IconifyJSON

      if (typeof item !== 'string' && item.icons?.length) {
        const filteredContent = getIcons(content, item.icons)
        if (!filteredContent) {
          throw new Error(`Cannot find required icons in ${filename}`)
        }
        content = filteredContent
      }

      removeMetaData(content)

      for (const key in content) {
        if (key === 'prefix' && content.prefix === 'tabler') {
          for (const key in content.icons) {
            content.icons[key].body = content.icons[key].body.replace(/stroke-width="2"/g, 'stroke-width="1.5"')
          }
        }
      }

      minifyIconSet(content)
      bundle += 'addCollection(' + JSON.stringify(content) + ');\n'
      console.log(`Bundled icons from ${filename}`)
    }
  }

  if (sources.svg) {
    for (let i = 0; i < sources.svg.length; i++) {
      const source = sources.svg[i]

      const iconSet = await importDirectory(source.dir, {
        prefix: source.prefix
      })

      await iconSet.forEach(async (name, type) => {
        if (type !== 'icon') {
          return
        }

        const svg = iconSet.toSVG(name)
        if (!svg) {
          iconSet.remove(name)

          return
        }

        try {
          await cleanupSVG(svg)

          if (source.monotone) {
            await parseColors(svg, {
              defaultColor: 'currentColor',
              callback: (attr, colorStr, color) => {
                return !color || isEmptyColor(color) ? colorStr : 'currentColor'
              }
            })
          }

          await runSVGO(svg)
        } catch (err) {
          console.error(`Error parsing ${name} from ${source.dir}:`, err)
          iconSet.remove(name)

          return
        }

        iconSet.fromSVG(name, svg)
      })
      console.log(`Bundled ${iconSet.count()} icons from ${source.dir}`)

      const content = iconSet.export()
      bundle += 'addCollection(' + JSON.stringify(content) + ');\n'
    }
  }

  await fs.writeFile(target, bundle, 'utf8')

  console.log(`Saved ${target} (${bundle.length} bytes)`)
})().catch(err => {
  console.error(err)
})

function removeMetaData(iconSet: IconifyJSON) {
  const props: (keyof IconifyMetaData)[] = ['info', 'chars', 'categories', 'themes', 'prefixes', 'suffixes']
  props.forEach(prop => {
    delete iconSet[prop]
  })
}

function organizeIconsList(icons: string[]): Record<string, string[]> {
  const sorted: Record<string, string[]> = Object.create(null)
  icons.forEach(icon => {
    const item = stringToIcon(icon)
    if (!item) {
      return
    }

    const prefix = item.prefix
    const prefixList = sorted[prefix] ? sorted[prefix] : (sorted[prefix] = [])

    const name = item.name
    if (prefixList.indexOf(name) === -1) {
      prefixList.push(name)
    }
  })

  return sorted
}
