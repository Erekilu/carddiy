package top.lsyweb.carddiy.controller;

import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.geometry.Positions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import top.lsyweb.carddiy.domain.Card;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * @Auther: Erekilu
 * @Date: 2020-02-24
 */
@Controller
@RestController
public class Load
{
	/**
	 * 处理异步上传的卡图
	 * @param file 卡图
	 */
	@PostMapping("/upload")
	public Map<String, Object> upload(@RequestParam("file") MultipartFile file)
	{
		Map<String, Object> map = new HashMap<>();
		// 如果文件为空
		if (file == null)
		{
			System.out.println("文件为空");
			map.put("success", false);
			map.put("message", "文件为空");
			return map;
		}

		/**
		 * 文件不为空，
		 * 1. 以UUID命名，把文件保存到本地
		 * 2. 将图片文件名保存到map中
		 */
		// 给图片命名
		String uuid = UUID.randomUUID().toString().replace("-", "");
		//获取上传文件名
		String fileName = file.getOriginalFilename();
		//获取后缀名
		String sname = fileName.substring(fileName.lastIndexOf("."));
		// 拼接成完整的文件名
		String fullName = uuid + sname;
		try
		{
			// 获取图片宽，高
			BufferedImage sourceImage = ImageIO.read(file.getInputStream());
			int width = Math.min(sourceImage.getWidth(), sourceImage.getHeight());
			Thumbnails.of(sourceImage)
					.sourceRegion(Positions.CENTER, width, width)
					.size(325, 325)
					.toFile(new File(getImgBasePath() + fullName));
			map.put("success", true);
			map.put("cardUuid", fullName);
		}
		catch (Exception e)
		{
			map.put("success", false);
			map.put("message", "本地创建图片失败：" + e.toString());
			throw new RuntimeException("本地创建图片失败：" + e.toString());
		}

		return map;
	}

	/**
	 * 接受卡片信息，并返回除描述框以外的半成品
	 * @param card 卡片信息
	 * @return
	 */
	@PostMapping("/startmake")
	public Map<String, Object> startmake(Card card)
	{
		Map<String, Object> map = new HashMap<>();
		// 这里保证前台的数据是妥当的
		System.out.println(card);

		/**
		 * 需要返回给前端的贴图路径
		 * 1. 用户上传图片路径
		 * 2. 卡牌种类
		 * 3. 卡牌版本
		 * 4. 卡牌稀有度 (卡牌版本和稀有度一起返回)
		 * 5. 卡牌名称
		 * 6. 卡牌颜色1， 卡牌颜色2 (卡底由主色决定)
		 * 7. 三围
		 * 8. 卡牌描述
		 */
		// 图片路径
		map.put("cardImg", "/cardimg/" + card.getCardUuid());

		// 卡牌种类贴图(查看双色有无模板，如无，返回主色模板)
		if (new File(getCardBasePath() + card.getCardType() + "/" + card.getCardColor1() + card.getCardColor2() + ".png").exists())
		{
			map.put("cardType", "/images/" + card.getCardType() + "/" + card.getCardColor1() + card.getCardColor2() + ".png");
		}
		else
		{
			map.put("cardType", "/images/" + card.getCardType() + "/" + card.getCardColor1() + ".png");
		}



		// 卡牌稀有度贴图
		map.put("cardQuality", "/images/quality/" + card.getCardQuility() + card.getCardVersion() + ".png");
		// 卡牌名称
		map.put("cardName", card.getCardName());
		// 卡牌颜色2
		map.put("cardColor2", "/images/color2/" + card.getCardColor2() + ".png");
		// 三围
		map.put("cardSale", "/images/number/" + card.getCardSale() + ".png");
		map.put("cardStrength", "/images/number/" + card.getCardStrength() + ".png");
		map.put("cardLife", "/images/number/" + card.getCardLife() + ".png");
		// 标识是生物还是神器
		map.put("flag", card.getCardType());
		// 标识神器是否需要耐久框
		if (card.getCardType().equals("artifact") && card.getCardLife() != 0) {
			map.put("artifactLife", true);
		}

		// 描述
		map.put("cardDesc", card.getCardDesc());

		return map;
	}

	/**
	 * 获取图片存放位置的根目录
	 * @return
	 */
	public static String getImgBasePath()
	{
		String os = System.getProperty("os.name");
		String basePath;

		// 判断系统
		if (os.toLowerCase().startsWith("win"))
		{
			basePath = "E:/cardimg/";
		}
		else
		{
			basePath = "/cardimg/";
		}
		return basePath;
	}

	public static String getCardBasePath()
	{
		String os = System.getProperty("os.name");
		String basePath;

		// 判断系统
		if (os.toLowerCase().startsWith("win"))
		{
			basePath = "E:/cardimg/cardbase/";
		}
		else
		{
			basePath = "/cardimg/cardbase/";
		}
		return basePath;
	}
}
