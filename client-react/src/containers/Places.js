import React from "react"
import {LoadScript} from "@react-google-maps/api"
import {withApollo} from "react-apollo"

import ZipCodeInput from "components/ZipCodeInput"
import RestaurantsList from "components/RestaurantsList"
import ErrorText from "components/ErrorText"

import {queries,mutations} from "graphql/Places/api"

const VISITED_PLACES_KEY = "visited_places"
const BACKEND = "GRAPHQL" //"LOCALSTORAGE"
const GOOGLE_API_LIBRARIES = ["places"]

class Places extends React.Component
{
  state = {
    currentUserId: "5cba0813e67b216504b457a6",
    fetched: false,
    data: [],
    pagination: null,
    buffer: "",
    zipcode: "",
    visitedPlaceIds: [],
  }

  async componentDidMount() {
    if (BACKEND === "LOCALSTORAGE") {
      this.setState({
        visitedPlaceIds: JSON.parse(localStorage.getItem(VISITED_PLACES_KEY)) || [],
      })
    } else if (BACKEND === "GRAPHQL") {
      let res = await this.props.client.query({
        query: queries.GET_VISITED_PLACES,
        variables: {
          userId: this.state.currentUserId,
        },
      })

      this.setState({
        visitedPlaceIds: res.data.visitedPlaces.map(element => element.place_id),
      })
    }
  }  

  changedSearchboxInput = (event) => {
    if (event.target.value.length <= 5) {
      this.setState({
        buffer: event.target.value,
      })
    }
  }

  fetchPlaces = () => {
    const zipcode = this.state.buffer
    const service = new window.google.maps.places.PlacesService(new window.google.maps.Map(<div/>))
    const req = {
      query: `food in ${zipcode}`,
      type: ["restaurant","food"],      
    }
    
    service.textSearch(req, (res,status, pagination) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        this.setState({
          error: false,
          fetched: true,
          data: res,
          pagination,
          zipcode
        })
      } else {
        this.setState({
          error: true,
          fetched: false,
          data: [],
          zipcode,
        })
      }
    })
  }

  fetchMorePlaces = () => {
    this.state.pagination.nextPage()
  }

  getCurrentNotVisited = () => {
    return this.state.data.filter(element => !this.state.visitedPlaceIds.includes(element.place_id))
  }

  getCurrentVisited = () => {    
    return this.state.data.filter(element => this.state.visitedPlaceIds.includes(element.place_id))
  }

  addPlaceToVisitedLS = (id) => {
    let arr = []
    if (localStorage.getItem(VISITED_PLACES_KEY)) {
      arr = JSON.parse(localStorage.getItem(VISITED_PLACES_KEY))
      arr.push(String(id))
      
    } else {
      arr = [String(id)]
    }

    localStorage.setItem(VISITED_PLACES_KEY,JSON.stringify(arr))

    this.setState({
      visitedPlaceIds: arr
    })
  }

  removePlaceFromVisitedLS = (id) => {
    if (localStorage.getItem(VISITED_PLACES_KEY)) {
      let arr = JSON.parse(localStorage.getItem(VISITED_PLACES_KEY))
      arr = arr.filter(element => element !== id)
      localStorage.setItem(VISITED_PLACES_KEY,JSON.stringify(arr))

      this.setState({
        visitedPlaceIds: arr
      })
    }
  }

  addPlaceToVisitedGQL = async (placeId) => {
    let res = await this.props.client.mutate({
      mutation: mutations.CREATE_VISITED_PLACE,
      variables: {
        visitedPlaceInput: {
          userId: this.state.currentUserId,
          place_id: placeId,
          name: this.state.data.filter(element => element.place_id === placeId)[0].name,
        }
      },
    })
    
    if (!res.error) {
      this.setState((prev) => {      
        let arr = prev.visitedPlaceIds
        arr.push(placeId)
        return {
          visitedPlaceIds: arr,
        }
      })
    }
  }

  removePlaceFromVisitedGQL = async (placeId) => {
    let res = await this.props.client.mutate({
      mutation: mutations.REMOVE_VISITED_PLACE,
      variables: {
        visitedPlaceInput: {
          userId: this.state.currentUserId,
          place_id: placeId,
        }
      }
    })
    
    if (!res.error) {
      this.setState((prev) => {
        return {
          visitedPlaceIds: prev.visitedPlaceIds.filter(element => element !== placeId),
        }
      })
    }
  }

  render() {
    const {buffer, zipcode, pagination} = this.state
    return <main>
      <h1>Find A Place to Eat</h1>
      <ZipCodeInput
        buffer={buffer}
        changedSearch={this.changedSearchboxInput}
        fetchPlaces={this.fetchPlaces}
        hasNextPage={pagination && pagination.hasNextPage}
        nextPage={this.fetchMorePlaces}
      />
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_JS_API_KEY}
        libraries={GOOGLE_API_LIBRARIES}
      >
        {
          this.state.error && <ErrorText message={`Error with Zipcode entered: ${this.state.zipcode}`}/>
        }
        {
          this.state.fetched && <section>
            <RestaurantsList
              title={`Places in Zipcode (${zipcode})`}
              places={this.getCurrentNotVisited()}
              onCheck={
                BACKEND === "LOCALSTORAGE" 
                  ? this.addPlaceToVisitedLS
                  : BACKEND === "GRAPHQL"
                    ? this.addPlaceToVisitedGQL
                    : null
              }
              visited={false}
            />
            <RestaurantsList
              title={`Already Visited (${zipcode})`}
              places={this.getCurrentVisited()}
              onCheck={
                BACKEND === "LOCALSTORAGE" 
                ? this.removePlaceFromVisitedLS
                : BACKEND === "GRAPHQL"
                  ? this.removePlaceFromVisitedGQL
                  : null
              }
              visited={true}
            />
          </section>
        }
      </LoadScript>
    </main>
  }
}

export default withApollo(Places)