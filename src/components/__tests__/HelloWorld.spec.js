import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Header from '../Header.vue'
import TodoItem from '../Todoitem.vue'

describe('Header Component', () => {
  it('renders application title', () => {
    const wrapper = mount(Header)
    expect(wrapper.text()).toContain('Todo List App')
  })
})

describe('TodoItem Component', () => {
  it('renders todo text correctly', () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: { id: 1, text: 'ทดสอบระบบ', done: false },
        isEditing: false,
        editText: ''
      }
    })
    expect(wrapper.text()).toContain('ทดสอบระบบ')
  })
})
