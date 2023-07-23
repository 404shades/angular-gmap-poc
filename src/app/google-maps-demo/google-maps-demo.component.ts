import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Datum, LocationTrackingRequest } from './location_tracking.dto';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-google-maps-demo',
  templateUrl: './google-maps-demo.component.html',
  styleUrls: ['./google-maps-demo.component.scss']
})
export class GoogleMapsDemoComponent implements OnInit {
  apiLoaded: Observable<boolean> | undefined;

  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;



  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  zoom = 8;

  locations: Datum[] = []

  vertices: google.maps.LatLngLiteral[] = [
    { lat: 13, lng: 13 },
    { lat: -13, lng: 0 },
    { lat: 13, lng: -13 },
  ];

  totalDistance: number = 0;
  averageSpeed: number = 0;

  polylineOptions: google.maps.PolygonOptions = {
    strokeColor: '#0000FF',
    strokeOpacity: 0.8,
    strokeWeight: 3,

  }

  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];





  constructor(private httpClient: HttpClient, private route: ActivatedRoute) {
    // If you're using the `<map-heatmap-layer>` directive, you also have to include the `visualization` library 
    // when loading the Google Maps API. To do so, you can add `&libraries=visualization` to the script URL:
    // https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization

    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyDdg979dwX1PkqmtAfWMJI1ztderabEtsQ', 'callback')
      .pipe(
        map(() => true),
        catchError(() => of(false)),
      );
  }

  openInfoWindow(marker: MapMarker) {
    this.infoWindow?.open(marker);
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params && params['code']) {
        this.httpClient.get(`http://api-dev.realapps.in/staff/operations/location-tracking/${params['code'] ?? 'EMP6363'}`).pipe(
          map((data: LocationTrackingRequest) => (data.response_data?.data ?? []).filter((a=>(a.accuracy??0)<6)))
        ).subscribe((data) => {
          this.locations = data;
          if (this.locations.length > 0) {
            //get center point from locations array
            const centerPoint = this.locations.reduce((accumulator, currentValue) => {
              return {
                latitude: accumulator.latitude! + currentValue.latitude!,
                longitude: accumulator.longitude! + currentValue.longitude!
              }
            }, { latitude: 0, longitude: 0 })
            centerPoint.latitude! /= this.locations.length;
            centerPoint.longitude! /= this.locations.length;

            this.center = { lat: centerPoint.latitude!, lng: centerPoint.longitude! }
            this.zoom = this.locations.length > 200 ? 14 : 16;
            this.vertices = this.locations.map((location) => {
              return { lat: location.latitude!, lng: location.longitude! }
            }

            )
            if (data[data.length - 1].odometer) {
              this.totalDistance = data[data.length - 1].odometer ?? 0;
              if (this.totalDistance > 1000) {
                this.totalDistance /= 1000;
              }
            }

            this.averageSpeed = data.reduce((accumulator, currentValue) => {
              return accumulator + currentValue.speed!
            }, 0) / data.length
            this.markerPositions = [this.vertices[0], this.vertices[this.vertices.length - 1]]



          }

        })
      }
    })

  }

}
