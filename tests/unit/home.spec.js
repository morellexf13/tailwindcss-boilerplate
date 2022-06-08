import { mount, flushPromises } from "@vue/test-utils"
import { setActivePinia, createPinia } from "pinia"
import { createTestingPinia } from "@pinia/testing"
import axios from "axios"
import { useStore } from "@stores/index"
import * as routerMock from "../routerMock"
import Home from "@pages/Home"

const FAKE_OK_RESPONSE = {
    timestamp: 1652728829262,
    context: {
        external_urls: {
            spotify: "https://open.spotify.com/album/6ndH0UlQbyCOVqByMXXhdV"
        },
        href: "https://api.spotify.com/v1/albums/6ndH0UlQbyCOVqByMXXhdV",
        type: "album",
        uri: "spotify:album:6ndH0UlQbyCOVqByMXXhdV"
    },
    progress_ms: 30963,
    item: {
        album: {
            album_type: "album",
            artists: [
                {
                    external_urls: {
                        spotify: "https://open.spotify.com/artist/2ye2Wgw4gimLv2eAKyk1NB"
                    },
                    href: "https://api.spotify.com/v1/artists/2ye2Wgw4gimLv2eAKyk1NB",
                    id: "2ye2Wgw4gimLv2eAKyk1NB",
                    name: "Metallica",
                    type: "artist",
                    uri: "spotify:artist:2ye2Wgw4gimLv2eAKyk1NB"
                }
            ],
            external_urls: {
                spotify: "https://open.spotify.com/album/6ndH0UlQbyCOVqByMXXhdV"
            },
            href: "https://api.spotify.com/v1/albums/6ndH0UlQbyCOVqByMXXhdV",
            id: "6ndH0UlQbyCOVqByMXXhdV",
            images: [
                {
                    height: 640,
                    url: "https://i.scdn.co/image/ab67616d0000b273d691ec833eb067d9a9e4ded7",
                    width: 640
                },
                {
                    height: 300,
                    url: "https://i.scdn.co/image/ab67616d00001e02d691ec833eb067d9a9e4ded7",
                    width: 300
                },
                {
                    height: 64,
                    url: "https://i.scdn.co/image/ab67616d00004851d691ec833eb067d9a9e4ded7",
                    width: 64
                }
            ],
            name: "Load",
            release_date: "1996-01-01",
            release_date_precision: "day",
            total_tracks: 14,
            type: "album",
            uri: "spotify:album:6ndH0UlQbyCOVqByMXXhdV"
        },
        artists: [
            {
                external_urls: {
                    spotify: "https://open.spotify.com/artist/2ye2Wgw4gimLv2eAKyk1NB"
                },
                href: "https://api.spotify.com/v1/artists/2ye2Wgw4gimLv2eAKyk1NB",
                id: "2ye2Wgw4gimLv2eAKyk1NB",
                name: "Metallica",
                type: "artist",
                uri: "spotify:artist:2ye2Wgw4gimLv2eAKyk1NB"
            }
        ],
        disc_number: 1,
        duration_ms: 304400,
        explicit: true,
        external_ids: {
            isrc: "GBAMC9600007"
        },
        external_urls: {
            spotify: "https://open.spotify.com/track/3QWzxUE2WA5WoSi82KCODk"
        },
        href: "https://api.spotify.com/v1/tracks/3QWzxUE2WA5WoSi82KCODk",
        id: "3QWzxUE2WA5WoSi82KCODk",
        is_local: false,
        name: "Ain't My Bitch",
        popularity: 47,
        preview_url:
            "https://p.scdn.co/mp3-preview/4bba3586d50d2aecb577227ea15ed8d5248fa1fb?cid=774b29d4f13844c495f206cafdad9c86",
        track_number: 1,
        type: "track",
        uri: "spotify:track:3QWzxUE2WA5WoSi82KCODk"
    },
    currently_playing_type: "track",
    actions: {
        disallows: {
            resuming: true,
            skipping_prev: true
        }
    },
    is_playing: true
}

const FAKE_BAD_RESPONSE = {
    error: {
        status: 401,
        message: "The access token expired"
    }
}
beforeEach(() => {
    jest.resetAllMocks()
    setActivePinia(createPinia())
    routerMock.injectRouter()
})

const mountComponent = () => {
    return mount(Home, {
        global: {
            plugins: [createTestingPinia()]
        }
    })
}

describe("User Session Suite", () => {
    it("should expect a logged out store state", () => {
        // 🥷🏻 Setup
        const store = useStore()
        // ✨ Assert
        expect(store.session.userIsLoggedIn).toBe(false)
    })

    it("should redirect to login after logout", async () => {
        // 🥷🏻 Setup
        const store = useStore()
        store.setUserLoggedIn(true)
        // 🧗🏻‍♂️ Mount the Login component
        const wrapper = mountComponent()
        // 🚨 Trigger login button clicked
        wrapper.find("#btn-logout").trigger("click")
        await flushPromises()
        // ✨ Assert
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith("/login")
    })

    it("should show the current track playing", async() => {
        // 📡 Mock API response
        axios.get = jest.fn(() => Promise.resolve({ data: FAKE_OK_RESPONSE }))
        const wrapper = mountComponent()
        // 🚨 Trigger login button clicked
        wrapper.find("#btn-track-spotify").trigger("click")
        await flushPromises()
        expect(wrapper.text()).toContain(
            "🎸 Playing  Ain't My Bitch by Metallica"
        )
    })

    it("should not show the current track playing", async() => {
        // 📡 Mock API response
        axios.get = jest.fn(() => Promise.reject(FAKE_BAD_RESPONSE))
        const wrapper = mountComponent()
        // 🚨 Trigger login button clicked
        wrapper.find("#btn-track-spotify").trigger("click")
        await flushPromises()
        expect(wrapper.text()).toContain("Play Spotify and see 👀")
    })
})
