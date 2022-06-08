import { mount, flushPromises, createLocalVue } from "@vue/test-utils"
import { setActivePinia, createPinia } from "pinia"
import { useStore } from "@stores/index"
import * as routerMock from "../routerMock"
import Login from "@pages/Login"

beforeEach(() => {
  jest.resetAllMocks()
  setActivePinia(createPinia())
  routerMock.injectRouter()
})

const mountComponent = () => {
  return mount(Login)
}

describe("User Session Suite", () => {
  it("should expect a logged in store state", () => {
    // 🥷🏻 Setup
    const store = useStore()
    store.setUserLoggedIn(true)
    // ✨ Assert
    expect(store.session.userIsLoggedIn).toBe(true)
  })

  it("should redirect to home page after login", () => {
    // 🧗🏻‍♂️ Mount the Login component
    const wrapper = mountComponent()
    // 🚨 Trigger login button clicked
    wrapper.find("#btn-login").trigger("click")
    // ✨ Assert
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith("/")
  })
})
