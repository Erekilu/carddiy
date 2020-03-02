package top.lsyweb.carddiy.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import top.lsyweb.carddiy.controller.Load;

/**
 * @Auther: Erekilu
 * @Date: 2020-02-25
 */
@Configuration
public class StaticSource implements WebMvcConfigurer
{
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		String str = Load.getImgBasePath();
		registry.addResourceHandler("/cardimg/**").addResourceLocations("file:" + str);
	}
}
