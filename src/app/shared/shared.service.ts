import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import * as moment from 'moment';

declare var io: any;

@Injectable()
export class SharedService {

  private subject = new Subject<any>();

  constructor() { }

  emitMsg(msg: any) {
    this.subject.next(msg);
  }

  getMsg(): Observable<any> {
    return this.subject.asObservable();
  }

  // initSocket() {
  //   const socket = io('http://localhost:3000');
  //   socket.on('[POST]http://localhost:3000/api/Orders', function (data) {
  //     console.log(data);
  //     socket.emit('my other event', { my: 'data' });
  //   });
  // }

  // scale image inside frame
  resizeImage(frame_w: number, frame_h: number, w: number, h: number) {
    let rw = 0;
    let rh = 0;

    if (h * frame_w / w > frame_h) {
      rh = frame_h;
      rw = w * frame_h / h;
    } else {
      rw = frame_w;
      rh = h * frame_w / w;
    }
    return { 'w': Math.round(rw), 'h': Math.round(rh), 'padding_top': Math.round((frame_h - rh) / 2) };
  }

  toDateTimeString(s) {
    // s --- dd-mm-yyy:hh:mm:ss.z000
    return s.split('.')[0].replace('T', ' ');
  }

  getTodayStart() {
    const m = moment(); // .utcOffset(0);
    return m.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
  }

  getNextDayStart(offset: number) {
    const m = moment(); // .utcOffset(0);
    return m.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add(offset, 'days').toDate();
  }


  getDateTime(s) {
    if (s) {
      return moment(s);
    } else {
      return moment();
    }
  }

  getNow() {
    return moment();
  }

  // type --- 'day', 'date', week', 'month', 'year', 12:00 am
  getStartOf(type) {
    return moment().startOf(type);
  }

  // type --- 'day', 'date', week', 'month', 'year', 23:59:59.999
  getEndOf(type) {
    return moment().endOf(type);
  }

  addDays(date, offset: number) {
    return date.add(offset, 'days');
  }

  formatDateTime(date) {
    return date.format('YYYY-MM-DDTHH:mm:ss') + '.000Z';
  }

  getToday() {
    const m = moment(); // .utcOffset(0);
    return m.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DDTHH:mm:ss') + '.000Z';
  }

  getTodayString() {
    const m = moment(); // .utcOffset(0);
    return m.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD');
  }



  getNextNDayString(offset: number) {
    return moment(new Date()).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add(offset, 'days')
      .format('YYYY-MM-DD');
  }

  compareDateTime(a: any, b: any) {
    return moment(a).isAfter(b);
  }

  isOverdue(h: number, m: number = 0) {
    const a = moment(new Date()).set({ hour: h, minute: m, second: 0, millisecond: 0 });
    const b = moment(new Date());
    return b > a;
  }



  getFirstDayOfMonth() {
    return moment().startOf('month').format('YYYY-MM-DDTHH:mm:ss') + '.000Z';
  }

  getLastDayOfMonth() {
    return moment().endOf('month').format('YYYY-MM-DDTHH:mm:ss') + '.000Z';
  }

  getMonday() {
    return moment().weekday(0).format('YYYY-MM-DDTHH:mm:ss') + '.000Z';
  }

  getNextMonday() {
    return moment().weekday(7).format('YYYY-MM-DDTHH:mm:ss') + '.000Z';
  }

  getNextDay() {
    const d = moment(new Date()).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add(1, 'days');
    return { day: d.date(), month: d.month() + 1, year: d.year() };
  }

  getApiUrl() {
    return environment.API_BASE + '/' + environment.API_VERSION + '/';
  }

  getApiBaseUrl() {
    return environment.API_BASE + '/';
  }

  getMediaUrl() {
    return environment.MEDIA_URL;
  }

}

