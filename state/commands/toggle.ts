import Command from './command'
import history from '../history'
import { Data, Shape } from 'types'
import { getPage, getSelectedShapes } from 'utils/utils'
import { getShapeUtils } from 'lib/shape-utils'
import { PropsOfType } from 'types'

export default function toggleCommand(
  data: Data,
  prop: PropsOfType<Shape, boolean>
) {
  const { currentPageId } = data
  const selectedShapes = getSelectedShapes(data)
  const isAllToggled = selectedShapes.every((shape) => shape[prop])
  const initialShapes = Object.fromEntries(
    selectedShapes.map((shape) => [shape.id, shape[prop]])
  )

  history.execute(
    data,
    new Command({
      name: 'hide_shapes',
      category: 'canvas',
      do(data) {
        const { shapes } = getPage(data, currentPageId)

        for (const id in initialShapes) {
          const shape = shapes[id]
          getShapeUtils(shape).setProperty(
            shape,
            prop,
            isAllToggled ? false : true
          )
        }
      },
      undo(data) {
        const { shapes } = getPage(data, currentPageId)

        for (const id in initialShapes) {
          const shape = shapes[id]
          getShapeUtils(shape).setProperty(shape, prop, initialShapes[id])
        }
      },
    })
  )
}