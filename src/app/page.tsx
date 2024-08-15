"use client";
import styles from './page.module.css';
import { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import CloudIcon from '@mui/icons-material/Cloud';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DehazeIcon from '@mui/icons-material/Dehaze';
import MasksIcon from '@mui/icons-material/Masks';

let WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY



function Clock({ targetTimeZoneOffset }: any): JSX.Element {
  const [currentTime, setCurrentTime] = useState(new Date(Date.now() + targetTimeZoneOffset));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date(Date.now() + targetTimeZoneOffset));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetTimeZoneOffset]);

  return <p className={styles.time}>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' })}</p>;
}


export default function Home() {
  const [place, setPlace] = useState("Mumbai");
  const [placeData, setPlaceData] = useState<any>(null)

  const getWeatherData = async () => {
    //# https://api.openweathermap.org/data/2.5/weather?q=mumbai&appid=WEATHER_API_KEY

    if(place && place.length >0){
      try{

        let url = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${WEATHER_API_KEY}`;

        let res = await fetch(url); //response
        let data = await res.json();
        console.log("GET WEATHER DATA RESPONSE",data);
        setPlaceData(data)
      }
      catch(err){
        console.log(err)
      }
    }
    
  }
  
  useEffect(() => {
    getWeatherData();
  }, [])

 
  const targetTimeZoneOffset = placeData?.timezone * 1000; //miliseconds 

  const currentDate = new Date(Date.now() + targetTimeZoneOffset).toLocaleDateString([], {
    weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC'
  })
  
  const currentTime = new Date(Date.now() + targetTimeZoneOffset).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    // second: '2-digit',
    timeZone: 'UTC'
  })
  
  //background images
  // const Temper = placeData?.main.temp;
  const getTemperatureClass = (Temperature : number) => {
    Temperature -= 273.15;
    // if(!Temper){
    //   return ''
    // }
    if (Temperature < 0) {
      return styles.coldest;
    } else if (Temperature >= 0 && Temperature < 15) {
      return styles.cold;
    } else if (Temperature >= 15 && Temperature < 30) {
      return styles.clear;
    } else if (Temperature >= 30 && Temperature < 45) {
      return styles.warm;
    }else {
      return styles.hot;
    }
  };


  return (
    <div className={`${styles.home} ${getTemperatureClass(placeData?.main.temp)}`}>
      <div className={styles.searchBar}>
        <input type= "search" placeholder="City Name" onChange={(e) => setPlace(e.target.value)} />
        <button onClick={getWeatherData}> <SearchIcon /> </button>
      </div>


    {
      placeData && <div className={styles.row}>
      <div className={styles.section1}>
        <div className={styles.section11}>
          {placeData.weather[0].main === 'Clouds' && 
          <CloudIcon className={styles.weatherIcon} />
          }
          {placeData.weather[0].main === 'Clear' && 
          <WbSunnyIcon className={styles.weatherIcon} />
          }
          {placeData.weather[0].main === 'Haze' && 
          <DehazeIcon className={styles.weatherIcon} />
          }
          {placeData.weather[0].main === 'Smoke' && 
          <MasksIcon className={styles.weatherIcon} />
          }
          <p className={styles.temp}>
            {(placeData?.main.temp - 273.15).toFixed(1)} <span> °C </span>
          </p>
          
        </div>
        <div className={styles.section11}>
          <p className={styles.city}> {placeData?.name} </p>
          <p className={styles.weatherType}> {placeData?.weather[0].main} </p>
      </div>
      </div>
      <div className={styles.timediv}>
          <p className={styles.time}>{currentDate}</p><Clock targetTimeZoneOffset={targetTimeZoneOffset} />
      </div>
      </div>
    }

    {
      placeData && 
      <div className={styles.section2}>

        <div className={styles.section21}>
          <p className={styles.head1}>Feels Like</p>
          <p className={styles.head2}>{(placeData?.main.feels_like - 273.15).toFixed(1)} °C</p>
        </div>

        <div className={styles.section21}>
          <p className={styles.head1}>Min Temperature</p>
          <p className={styles.head2}>{(placeData?.main.temp_min - 273.15).toFixed(1)} °C</p>
        </div>

        <div className={styles.section21}>
          <p className={styles.head1}>Max Temperature</p>
          <p className={styles.head2}>{(placeData?.main.temp_max - 273.15).toFixed(1)} °C</p>
        </div>

        <div className={styles.section21}>
          <p className={styles.head1}>Humidity</p>
          <p className={styles.head2}>{(placeData?.main.humidity).toFixed(1)} %</p>
        </div>

        <div className={styles.section21}>
          <p className={styles.head1}>Pressure</p>
          <p className={styles.head2}>{(placeData?.main.pressure)} hPa</p>
        </div>

        <div className={styles.section21}>
          <p className={styles.head1}>Visibility</p>
          <p className={styles.head2}>{(placeData?.visibility)} m</p>
        </div>

        <div className={styles.section21}>
          <p className={styles.head1}>Wind Speed</p>
          <p className={styles.head2}>{(placeData?.wind.speed)} m/s</p>
        </div>

      </div>
    }


    </div>
  );
}
