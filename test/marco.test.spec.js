import test from 'ava'
import marco from '../components/marco'
import { mount, shallowMount } from '@vue/test-utils'

test('mount example', (t) => {
  const wrapper = mount(marco)
  console.log('Wrapper with a mount function', wrapper.html())
  t.truthy(true)
})

test('shallow example', (t) => {
  const wrapper = shallowMount(marco)
  console.log('Wrapper with a shallowMount function', wrapper.html())
  t.truthy(true)
})

test('Check if p component does not exists with a shallowMount function', (t) => {
  const wrapper = shallowMount(marco)
  t.falsy(wrapper.find('#pcomponent').exists())
})

test('Check if p component exists with a mount function', (t) => {
  const wrapper = mount(marco)
  t.truthy(wrapper.find('#pcomponent').exists())
})

test('Check if p element with id val1p has the right value', (t) => {
  // mounting the component
  const wrapper = mount(marco)
  // test if it exists using the selectior id
  t.is(wrapper.find('#val1p').exists(), true)
  // test if the value of the p is the same of the data
  t.is(wrapper.find('#val1p').element.innerHTML, 'value1')
})

test('Change input make a mutation on p element', (t) => {
  // mounting the component
  const wrapper = mount(marco)
  // setting a new value for the input
  const valueChanged = 'Marco'
  // test if it exists using the selectior id
  t.is(wrapper.find('#val1').exists(), true)
  // change the value of the element
  wrapper.find('#val1').element.value = valueChanged
  // trigger an input event
  wrapper.find('#val1').trigger('input')
  // check if the value of the p is the new element
  t.is(wrapper.find('#val1p').element.innerHTML, valueChanged)
  // testing the checbox value is set to false
})