// ابزارهای اصلی Redux Toolkit:
// createSlice برای ساخت slice (state + reducers)
// createAsyncThunk برای ساخت اکشن async که خودش pending/fulfilled/rejected می‌سازه
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// تابعی که با دادن latitude/longitude از API آدرس متنی برمی‌گرداند (Reverse Geocoding)
import { getAddress } from "../../services/apiGeocoding";

// این تابع، API مرورگر (Geolocation) را به شکل Promise درمی‌آورد
// تا بتوانیم با async/await از آن استفاده کنیم.
function getPosition() {
  return new Promise(function (resolve, reject) {
    // getCurrentPosition دو callback می‌گیرد:
    // resolve وقتی موفق شد (موقعیت را می‌دهد)
    // reject وقتی خطا شد (مثلاً کاربر اجازه نداد)
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// ساخت thunk async با اسم "user/fetchAddress"
// این thunk وقتی dispatch شود، 3 اکشن تولید می‌کند:
// 1) user/fetchAddress/pending
// 2) user/fetchAddress/fulfilled
// 3) user/fetchAddress/rejected
export const fetchAddress = createAsyncThunk(
  "user/fetchAddress",
  // payloadCreator: تابع async (ورودی دوم createAsyncThunk)
  // هر چیزی که اینجا return کنیم، در fulfilled داخل action.payload خواهد بود
  async function () {
    // 1) گرفتن موقعیت کاربر از مرورگر
    const positionObj = await getPosition();

    // تبدیل آبجکت خروجی geolocation به شکل ساده‌تر
    const position = {
      latitude: positionObj.coords.latitude,
      longitude: positionObj.coords.longitude,
    };

    // 2) ارسال lat/lng به سرویس reverse geocoding برای گرفتن اطلاعات آدرس
    const addressObj = await getAddress(position);

    // ساخت یک رشته آدرس قابل نمایش از داده‌های برگشتی
    const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

    // 3) خروجی نهایی thunk:
    // این آبجکت در fulfilled می‌شود action.payload
    return { position, address };
  },
);

// state اولیه slice یوزر
const initialState = {
  // نام کاربری که کاربر وارد می‌کند (sync)
  username: "",

  // وضعیت درخواست async:
  // idle: حالت عادی
  // loading: در حال دریافت آدرس
  // error: خطا رخ داده
  status: "idle",

  // ذخیره lat/lng کاربر
  position: {},

  // آدرس متنی برگشتی از API
  address: "",

  // پیام خطا در صورت fail شدن درخواست
  error: "",
};

// ساخت slice مربوط به user
const userSlice = createSlice({
  // نام slice (در type اکشن‌ها هم اثر دارد)
  name: "user",

  // state اولیه
  initialState,

  // reducers: اکشن‌های داخلی/سینک همین slice
  reducers: {
    // اکشن sync برای آپدیت username
    updateName: (state, action) => {
      // action.payload همان مقداری است که dispatch می‌کنی
      state.username = action.payload;
    },
  },

  // extraReducers: واکنش به اکشن‌های "خارج از reducers"
  // مهم‌ترین موردش اکشن‌های createAsyncThunk است
  extraReducers: (builder) =>
    builder

      // وقتی thunk شروع می‌شود: pending
      .addCase(fetchAddress.pending, (state) => {
        // می‌گوییم در حال لود شدن هستیم
        state.status = "loading";

        // خطای قبلی را پاک می‌کنیم تا UI تمیز باشد
        state.error = "";
      })

      // وقتی thunk موفق شود: fulfilled
      .addCase(fetchAddress.fulfilled, (state, action) => {
        // برمی‌گردیم به حالت عادی
        state.status = "idle";

        // action.payload همان چیزی است که داخل thunk return کردیم
        state.address = action.payload.address;
        state.position = action.payload.position;

        // اگر قبلاً خطا بوده پاک شود
        state.error = "";
      })

      // وقتی thunk خطا دهد: rejected
      .addCase(fetchAddress.rejected, (state, action) => {
        // وضعیت خطا
        state.status = "error";

        // پیام خطا از طرف RTK (یا خطای خود promise)
        state.error =
          "we have some problem with getting your address. make sure to fill this form correctly";
      }),
});

// خروجی گرفتن اکشن‌کریتورهای reducers داخلی slice
// یعنی updateName یک action creator است
export const { updateName } = userSlice.actions;

// خروجی گرفتن reducer تا در configureStore استفاده شود
export default userSlice.reducer;
